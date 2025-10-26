/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Offre } from './offer.entity';
import { DataSource, Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import { CreateOffreDto, Type, UpdateOffreDto } from 'src/dto/offer.service.dto';
import { Request } from 'node_modules/@types/express';
import { RequestWithUser } from 'src/dto/auth.dto';

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offre) private readonly offerRepository : Repository<Offre>,
        @InjectRepository(User) private readonly userRepository : Repository<User>,
        private readonly dataSource : DataSource
    ) {}

    async AddOffer(dto : CreateOffreDto, req : RequestWithUser) {
        let type: Type;
    if (req.user?.role === 'client') {
        type = Type.CLIENT_OFFER;
    } else {type = Type.FREELANCE_OFFER;}

    const offer = this.offerRepository.create({
          ...dto,
          type,
          user: { id: req.user.id },
        });

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
        return {message : 'offer deleted successfully'}
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
        where : {id : userId},
        relations: ['enrolledOffres'],
    })


    if (!offer) throw new NotFoundException('Offer not found');
    if (!user) throw new BadRequestException('User not found');
    if (offer.enroledUsers.some((u) => u.id === userId))
      throw new BadRequestException('Already enrolled');

    offer.enroledUsers.push(user);
    user.enrolledOffres.push(offer);

    await userRepo.save(user);
    await offerRepo.save(offer);

    return {message : 'User enrolled successfully'}
  });
}


}