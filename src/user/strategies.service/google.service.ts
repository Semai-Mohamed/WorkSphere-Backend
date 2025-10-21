/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "node_modules/@nestjs/common";
import { Repository } from "node_modules/typeorm";
import { User } from "../user.entity";
import { AuthProvider } from "src/dto/user.dto";

@Injectable()
export class GoogleService{
constructor(private readonly userRepository: Repository<User>,){ }
async createFromGoogle(profile : any,done : any , accessToken : anyp){
    const { emails, name, photos } = profile;
        const email = emails[0].value;
        const firstName = name?.givenName || '';
        const lastName = name?.familyName || '';
        const photo = photos?.[0]?.value || null;
    
        let user = await this.userRepository.findOne({ where: { email } });
    
        if (!user) {
          user = this.userRepository.create({
            email,
            firstName,
            lastName,
            photo,
            isEmailConfirmed: true, 
            provider: AuthProvider.GOOGLE,
          });
    
          user = await this.userRepository.save(user);
        }
    
        done(null, { ...user, accessToken });

  }
}