import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { Offre } from './offer.entity';
import { CreateOffreDto, UpdateOffreDto } from 'src/dto/offer.service.dto';
import type { RequestWithUser } from 'src/dto/auth.dto';
import { GetUserId } from 'src/common/user.decorator';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}
  @CheckPolicies('create', Offre)
  @Post('add')
  addOffer(@Body() dto: CreateOffreDto, @Req() userId: RequestWithUser) {
    return this.offerService.AddOffer(dto, userId);
  }

  @CheckPolicies('read', Offre)
  @Get('user/:id')
  getOffersByUser(@Param('id') userId: number) {
    return this.offerService.GetOffersByUser(userId);
  }

  @CheckPolicies('read', Offre)
  @Get(':id')
  getOfferById(@Param('id') offerId: number) {
    return this.offerService.GetOfferById(offerId);
  }

  @CheckPolicies('update', Offre)
  @Patch(':id')
  updateOffer(@Param('id') offerId: number, @Body() dto: UpdateOffreDto) {
    return this.offerService.updateOffer(offerId, dto);
  }

  @CheckPolicies('delete', Offre)
  @Delete(':id')
  deleteOffer(@Param('id') offerId: number) {
    return this.offerService.deleteOffer(offerId);
  }

  @CheckPolicies('enrol', Offre, 'enroledUsers')
  @Patch('enrolled/:id')
  async enrolUser(@Param('id') offerId: number, @GetUserId() userId: number) {
    return this.offerService.enrolled(userId, offerId);
  }

  @CheckPolicies('enrol', Offre, 'enroledUsers')
  @CheckPolicies('update', Offre)
  @Patch('unenrolled/user/:id/:userId')
  async unenrolUser(@Param('id') offerId: number, @Param('userId') userId: number) {
    return this.offerService.unenroll(userId, offerId);
  }

  @CheckPolicies('read', Offre)
  @Get('enrolled/:id')
  async getEnrolledUsers(@Param('id') offerId: number) {
    return this.offerService.getEnrolledUsers(offerId);
  }

  @CheckPolicies('read', Offre)
  @Get('enrolled/user/:id')
  async getEnrolledOffers(@Param('id') userId: number) {
    return this.offerService.getEnrolledOffers(userId);
  }

    @CheckPolicies('update', Offre)
    @Patch('accept/:id/:userId')
    async acceptUser(
        @Param('id') offerId: number,
        @Param('userId') userId: number,
    ) {
        return this.offerService.acceptOffer(offerId, userId);
    }

    @CheckPolicies('update', Offre)
    @Patch('unaccept/:id')
    async unacceptUser(@Param('id') offerId: number) {
        return this.offerService.unacceptOffer(offerId)
    }

    @Patch('approveFinished/:id')
    async approveOffer(@Param('id') offerId: number, @GetUserId() userId: number) {
        return this.offerService.approveFinishedByOwner(offerId, userId);
    }
}
