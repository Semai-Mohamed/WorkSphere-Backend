import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Repository } from 'node_modules/typeorm';
import { Offre } from 'src/offer/offer.entity';
import { User } from 'src/user/user.entity';
import { Conversation } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Offre)
    private readonly offerRepository: Repository<Offre>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
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
    if (!offer) throw new NotFoundException('cannot find the offer');
    if (offer.user.id !== clientId)
      throw new ForbiddenException('You are not the owner of this offer');
    const freelancer = offer.enroledUsers.find((u) => u.id === freelancerId);
    if (!freelancer)
      throw new ForbiddenException(
        'this freelancer did not enroll in this offer',
      );
    let conversation = await this.conversationRepository.findOne({
      where: {
        offre: { id: offerId },
        creator: { id: clientId },
        participant: { id: freelancerId },
      },
    });

    if (conversation)
      throw new BadRequestException('this conversation already existe');
    conversation = this.conversationRepository.create({
        creator : offer.user,
        participant : freelancer,
        offre : offer
    });
    await this.conversationRepository.save(conversation)
    return conversation
  }
}
