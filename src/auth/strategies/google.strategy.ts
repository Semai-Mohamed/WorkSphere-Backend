/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'node_modules/typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService : ConfigService,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('URI_REDIRECTION') as string,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;

    // Check if user exists in DB by email
    const email = emails[0].value;
    const user = await this.userRepository.findOne({where: {email}})

    if (!user) {
      // Create user if not exists
        user = await this.userService.createFromGoogle({
        email,
        firstName: name.givenName,
        lastName: name.familyName,
        avatar: photos[0].value,
      });
    }

    // The object you return here will be available in req.user
    done(null, { ...user, accessToken });
  }
}

