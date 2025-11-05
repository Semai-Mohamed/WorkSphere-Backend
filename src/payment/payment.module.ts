import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm/dist/typeorm.module';
import { Offre } from 'src/offer/offer.entity';
import { StripeWebhookController } from './payment.controller';
import { OfferModule } from 'src/offer/offer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offre, User]), forwardRef(() => OfferModule)],
  providers: [PaymentService],
  controllers: [StripeWebhookController],
  exports: [PaymentService],
})
export class PaymentModule {}
