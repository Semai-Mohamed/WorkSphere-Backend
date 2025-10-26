import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { Offre } from './offer.entity';
import { CreateOffreDto } from 'src/dto/offer.service.dto';
import { GetUserId } from 'src/common/user.decorator';

@Controller('offer')
export class OfferController {
    constructor(private readonly offerService : OfferService){}
    @CheckPolicies('create', Offre)
    @Post('add')
    addOffer(@Body() dto : CreateOffreDto,@GetUserId() userId : number){
        return this.offerService.AddOffer(dto,userId)
    }

    @CheckPolicies('read', Offre)
    @Get('user/:id')
    getOffersByUser(@Param('id') userId : number){
        return this.offerService.GetOffersByUser(userId)
    }

    @CheckPolicies('read', Offre)
    @Get(':id')
    getOfferById(@Param('id') offerId : number){
        return this.offerService.GetOfferById(offerId)
    }

    @CheckPolicies('update', Offre)
    @Patch(':id')
    updateOffer(@Param('id') offerId : number,@Body() dto : CreateOffreDto){
        return this.offerService.updateOffer(offerId,dto)
    }

    @CheckPolicies('delete', Offre)
    @Delete(':id')
    deleteOffer(@Param('id') offerId : number){
        return this.offerService.deleteOffer(offerId)
    }
}
