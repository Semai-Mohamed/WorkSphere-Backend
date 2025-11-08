import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offre } from 'src/offer/offer.entity';
import { User } from 'src/user/user.entity';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Offre)
    private readonly offerRepository: Repository<Offre>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly notificationService : NotificationService
  ) {}

  async openConversation(
    offerId: number,
    clientId: number,
    freelancerId: number,
  ) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['user', 'enroledUsers'],
    });

    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.user.id !== clientId)
      throw new ForbiddenException('You are not the owner of this offer');

    const freelancer = offer.enroledUsers.find((u) => u.id === freelancerId);
    if (!freelancer)
      throw new ForbiddenException(
        'This freelancer did not enroll in this offer',
      );

    let conversation = await this.conversationRepository.findOne({
      where: {
        offre: { id: offerId },
        creator: { id: clientId },
        participant: { id: freelancerId },
      },
    });

    if (conversation)
      throw new BadRequestException('This conversation already exists');

    conversation = this.conversationRepository.create({
      creator: offer.user,
      participant: freelancer,
      offre: offer,
    });

    await this.conversationRepository.save(conversation);
    return conversation;
  }

  async createMessage(
    conversationId: number,
    content: string,
    senderId: number,
    participantId: number,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['creator', 'participant'],
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    if (
      ![conversation.creator.id, conversation.participant.id].includes(senderId)
    )
      throw new ForbiddenException('You are not part of this conversation');

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) throw new NotFoundException('cannot found the sender')
    const participant = await this.userRepository.findOne({
      where: { id: participantId },
    });
    if (!participant) throw new NotFoundException('cannot found the participant')

    const message = this.messageRepository.create({
      content,
      conversation,
      creator: sender,
      participant,
    });
    if(!message) throw new BadRequestException('cannot create this message')
    await this.notificationService.createNotification(
        {
          message : `User ${sender.firstName +' '+ sender.lastName} send you a new message`,
          purpose : 'NEW MESSAGE'
        },
        participant.id
      )
    const savedMessage = await this.messageRepository.save(message);
    return savedMessage;
  }

  async getMessageByConversation(conversationId : number,userId : number){
   const conversation = await this.conversationRepository.findOne({where : {id : conversationId},relations : ['creator','participant']})
   if (!conversation) throw new NotFoundException('cannot find this conversation')
    if(conversation.creator.id !== userId && conversation.participant.id !==userId) throw new UnauthorizedException("you cannot perform this action")
   const  messages = await this.messageRepository.find({where : {conversation : {id : conversationId}},order : {createdAt : 'ASC'}})
   if (!messages) throw new NotFoundException('cannot get messages with this conversationId')
    return messages
  }
}
