/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OfferService } from 'src/offer/offer.service';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/auth.metadata';

@Public()
@Controller('webhooks')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly offerService: OfferService,
    private readonly paymentService: PaymentService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2025-10-29.clover',
      },
    );
  }

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret =
      this.configService.get('STRIPE_WEBHOOK_SECRET') || '';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'] as Buffer,
        sig,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        await this.paymentService.markAsPaid(
          paymentIntent.metadata.offerId,
          paymentIntent.metadata.freelancerId,
        );
        break;

      case 'charge.refunded':
        const refund = event.data.object;

        await this.paymentService.markAsRefunded(refund.metadata.offerId);
        break;

      case 'transfer.created':
        const transfer = event.data.object;

        await this.paymentService.markAsFinshed(transfer.metadata.offerId);
        break;

      case 'account.updated':
        const account = event.data.object;
        console.log('Account updated:', account.id);
        if (!account.details_submitted) {
          return 'not all details submitted yet';
        }
        if (!account.metadata)
          throw new NotFoundException('Cannot find the user metadata');
        const userId = account.metadata.userId;
        await this.paymentService.linkStripeAccount(
          account.id,
          
          userId,
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
