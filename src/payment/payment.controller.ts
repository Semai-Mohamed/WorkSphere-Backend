/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OfferService } from 'src/offer/offer.service'; // wherever you handle DB logic

@Controller('webhooks')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly offerService: OfferService
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || "", {
            apiVersion: '2025-10-29.clover',
        });
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET') || "";
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'], // rawBody must be configured in main.ts (see below)
        sig,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle event types you care about:
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // ✅ Mark offer as PAID in DB
        await this.offerService.markAsPaid(paymentIntent.metadata.offerId);
        break;

      case 'payment_intent.canceled':
      case 'payment_intent.payment_failed':
        const failed = event.data.object ;
        await this.offerService.markAsPaymentFailed(failed.metadata.offerId);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        // 🔁 Mark offer as refunded
        await this.offerService.markAsRefunded(refund.metadata.offerId);
        break;

      case 'transfer.paid':
        const transfer = event.data.object as Stripe.Transfer;
        // 💸 Mark that freelancer received payment
        await this.offerService.markAsPaidToFreelancer(
          transfer.metadata.offerId,
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
