/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Offre } from './offer.entity';
import { DataSource, Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import {
  CreateOffreDto,
  Status,
  Type,
  UpdateOffreDto,
} from 'src/dto/offer.service.dto';
import { RequestWithUser } from 'src/dto/auth.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offre)
    private readonly offerRepository: Repository<Offre>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async AddOffer(dto: CreateOffreDto, req: RequestWithUser) {
    let type: Type;
    if (req.user?.role === 'client') {
      type = Type.CLIENT_OFFER;
    } else {
      type = Type.FREELANCE_OFFER;
    }

    const offer = this.offerRepository.create({
      ...dto,
      type,
      user: { id: req.user.id },
    });

    if (!offer) throw new BadRequestException('Cannot create offer');
    return await this.offerRepository.save(offer);
  }

  async GetOffersByUser(userId: number) {
    const offers = await this.offerRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!offers) throw new BadRequestException('Cannot get offers');
    return offers;
  }
  async GetOfferById(offerId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['user', 'enroledUsers', 'accepted'],
    });
    if (!offer) throw new NotFoundException('Cannot get offer');
    return offer;
  }

  async updateOffer(offerId: number, dto: UpdateOffreDto) {
    const offer = await this.GetOfferById(offerId);
    if (!offer) throw new NotFoundException('cannot find your offer');
    const updatedOffer = await this.offerRepository.preload({
      ...dto,
      id: offer.id,
    });
    if (!updatedOffer)
      throw new BadRequestException('cannot update your offer');
    return await this.offerRepository.save(updatedOffer);
  }

  async deleteOffer(offerId: number) {
    const offer = await this.GetOfferById(offerId);
    await this.offerRepository.remove(offer);
    return { message: 'offer deleted successfully' };
  }

  async enrolled(userId: number, offerId: number) {
    return this.dataSource.transaction(async (manager) => {
      const offerRepo = manager.getRepository(Offre);
      const userRepo = manager.getRepository(User);
      const offer = await offerRepo.findOne({
        where: { id: offerId },
        relations: ['enroledUsers'],
      });
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['enrolledOffres'],
      });
      if (!offer) throw new NotFoundException('Offer not found');
      if (!user) throw new BadRequestException('User not found');
      if (offer.enroledUsers.some((u) => u.id === userId))
        throw new BadRequestException('Already enrolled');
      offer.enroledUsers.push(user);
      user.enrolledOffres.push(offer);
      await userRepo.save(user);
      await offerRepo.save(offer);
      return { message: 'User enrolled successfully' };
    });
  }

  async unenroll(userId: number, offerId: number) {
    return this.dataSource.transaction(async (manager) => {
      const offerRepo = manager.getRepository(Offre);
      const userRepo = manager.getRepository(User);
      const offer = await offerRepo.findOne({
        where: { id: offerId },
        relations: ['enroledUsers'],
      });
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['enrolledOffres'],
      });
      if (!offer) throw new NotFoundException('Offer not found');
      if (!user) throw new BadRequestException('User not found');
      if (!offer.enroledUsers.some((u) => u.id === userId))
        throw new BadRequestException('Not enrolled');
      offer.enroledUsers = offer.enroledUsers.filter((u) => u.id !== userId);
      user.enrolledOffres = user.enrolledOffres.filter((o) => o.id !== offerId);
      await userRepo.save(user);
      await offerRepo.save(offer);
      return { message: 'User unenrolled successfully' };
    });
  }

  async getEnrolledUsers(offerId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['enroledUsers'],
    });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer.enroledUsers;
  }

  async getEnrolledOffers(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['enrolledOffres'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.enrolledOffres;
  }

  async acceptOffer(offerId: number, userId: number) {
    const offer = await this.GetOfferById(offerId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (offer.accepted && offer.accepted.id !== userId)
      throw new BadRequestException('Offer already accepted by a user');
    offer.accepted = user;
    offer.status = Status.NOTFINISHED;
    await this.offerRepository.save(offer);
    return { message: 'User accepted successfully' };
  }

  async unacceptOffer(offerId: number) {
    const offer = await this.GetOfferById(offerId);
    if (!offer.accepted)
      throw new BadRequestException('Offer not accepted by any user');
    offer.accepted = null;
    await this.offerRepository.save(offer);
    return { message: 'User unaccepted successfully' };
  }

    async approveFinishedByOwner(offerId: number, userId: number) {
    const offer = await this.GetOfferById(offerId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (offer.user.id !== userId || !offer.accepted)
      throw new BadRequestException(
        'Only the owner can approve the offer if there is an accepted user',
      );
    offer.status = Status.FINISHED;
    await this.offerRepository.save(offer);
    return { message: 'Offer approved successfully' };
  }
}
