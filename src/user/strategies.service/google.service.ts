/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadGatewayException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { AuthProvider } from 'src/dto/user.dto';
import { JwtStrategy } from 'src/common/strategies/token/jwt.strategy';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtStrategy: JwtStrategy,
  ) {}
  async createFromGoogle(profile: any, done: any) {
    const { emails, name } = profile;
    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';
    try {
      let user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        user = this.userRepository.create({
          email,
          firstName,
          lastName,
          isEmailConfirmed: true,
          provider: AuthProvider.GOOGLE,
        });

        user = await this.userRepository.save(user);
      }

      if (!user) {
        throw new BadGatewayException('could not sign in with google');
      }
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
