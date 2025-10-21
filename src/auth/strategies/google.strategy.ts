import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from 'src/user/strategies.service/google.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleService : GoogleService,
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
    await this.googleService.createFromGoogle(profile,done,accessToken)}
}
