import { forwardRef, Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Offre } from './offer.entity';
import { CaslModule } from 'src/casl/casl.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Offre]),
    CaslModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
