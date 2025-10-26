import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Offre } from './offer.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User,Offre])],
  controllers: [OfferController],
  providers: [OfferService]
})
export class OfferModule {}
