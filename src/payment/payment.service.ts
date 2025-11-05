import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from 'node_modules/@nestjs/config';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Repository } from 'node_modules/typeorm/repository/Repository';
import { Status } from 'src/dto/offer.service.dto';
import { Offre } from 'src/offer/offer.entity';
import { User } from 'src/user/user.entity';
import Stripe from 'stripe';
@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Offre)
    private readonly offerRepository: Repository<Offre>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2025-10-29.clover',
      },
    );
  }

  async createFreelancerAccount(userId: number) {
    const account = await this.stripe.accounts.create({ type: 'express' });
    const link = await this.stripe.accountLinks.create({
      account: account.id,
      refresh_url: this.configService.get('BackendHost') + '/onboarding/failed',
      return_url: this.configService.get('BackendHost') + '/onboarding/success',
      type: 'account_onboarding',
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    user.stripeAccountId = account.id;
    await this.userRepository.save(user);
    return { url: link.url };
  }

  async createPaymentIntent(offerId: number, clientId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['accepted'],
    });
    if (!offer) throw new BadRequestException('Offer not found');
    const freelancer = offer.accepted;
    if (!freelancer?.stripeAccountId)
      throw new NotFoundException('Freelancer Stripe account not found');
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Number(offer.price) * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      capture_method: 'manual',
      transfer_data: { destination: freelancer.stripeAccountId },
      metadata: {
        offerId: offer.id,
        clientId: clientId,
        freelancerId: freelancer.id,
      },
    });
    offer.paymentIntentId = paymentIntent.id;
    await this.offerRepository.save(offer);
    return { clientSecret: paymentIntent.client_secret };
  }

  async releasePayment(offerId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
    });
    if (offer?.status !== Status.FINISHED)
      throw new BadRequestException('Offer not finished yet');
    if (!offer?.paymentIntentId)
      throw new NotFoundException('Payment not found');
    const paymentIntent = await this.stripe.paymentIntents.capture(
      offer.paymentIntentId,
    );
    return paymentIntent;
  }

  async refundPayment(offerId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
    });
    if (!offer?.paymentIntentId)
      throw new NotFoundException('Payment not found');

    const refund = await this.stripe.refunds.create({
      payment_intent: offer.paymentIntentId,
    });
    return refund;
  }

  async markAsPaid(offerId: string, userId: string) {
    const id = parseInt(offerId);
    const UserId = parseInt(userId);
    const user = await this.userRepository.findOne({ where: { id: UserId } });
    const offer = await this.offerRepository.findOne({ where: { id: id } });
    if (!offer) throw new NotFoundException('Offer not found');
    offer.accepted = user;
    offer.status = Status.NOTFINISHED;
    await this.offerRepository.save(offer);
  }

  async markAsRefunded(offerId: string) {
    const id = parseInt(offerId);
    const offer = await this.offerRepository.findOne({ where: { id: id } });
    if (!offer) throw new NotFoundException('Offer not found');
    offer.accepted = null;
    offer.status = Status.NOTAPPROVED;
    await this.offerRepository.save(offer);
  }

  async markAsFinshed(offerId: string) {
    const id = parseInt(offerId);
    const offer = await this.offerRepository.findOne({ where: { id: id } });
    if (!offer) throw new NotFoundException('Offer not found');
    offer.status = Status.FINISHED;
    await this.offerRepository.save(offer);
  }
}
