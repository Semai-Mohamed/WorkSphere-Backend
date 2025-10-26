import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Offre } from './offer.entity';
import { Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import { CreateOffreDto, UpdateOffreDto } from 'src/dto/offer.service.dto';

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offre) private readonly offerRepository : Repository<Offre>,
        @InjectRepository(User) private readonly userRepository : Repository<User>,
    ) {}

    async AddOffer(dto : CreateOffreDto, userId : number) {
       const offer = this.offerRepository.create({
        ...dto,
        user : {id : userId}
       })
       if(!offer) throw new BadRequestException('Cannot create offer')
       return await this.offerRepository.save(offer)
    }

    async GetOffersByUser(userId : number) {
        const offers = await this.offerRepository.find({
            where : {user : {id : userId}},
            relations : ['user']
        })
        if(!offers) throw new BadRequestException('Cannot get offers')
        return offers
    }
    async GetOfferById(offerId : number) {
        const offer = await this.offerRepository.findOne({
            where : {id : offerId},
            relations : ['user']
        })
        if(!offer) throw new NotFoundException('Cannot get offer')
        return offer
    }

    async updateOffer(offerId : number, dto : UpdateOffreDto) {
        const offer = await this.GetOfferById(offerId)
        if(!offer) throw new NotFoundException("cannot find your offer")
        const updatedOffer = await this.offerRepository.preload({
            ...dto,
            id : offer.id,
            
        })
        if(!updatedOffer) throw new BadRequestException("cannot update your offer")
        return await this.offerRepository.save(updatedOffer)
    }

    async deleteOffer(offerId : number) {
        const offer = await this.GetOfferById(offerId)
        await this.offerRepository.remove(offer)
    }

}