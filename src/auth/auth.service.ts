/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RedisClient } from './strategies/redis.strategy/redis.client';
import { EmailCheckDto, PasswordCheckDto } from 'src/dto/auth.dto';


@Injectable()
export class AuthService {
    constructor(
        private userService : UserService,
        private jwtStrategy : JwtStrategy,
        private redisClient : RedisClient
        
    ){}
    async signUP(createUserDto : CreateUserDto) : Promise<User>{
        const user = await this.userService.signUp(createUserDto)
        if(!user) {
            throw new BadRequestException('User creation failed')
        }
        return user
    }

    async signIn(loginUserDto : LoginUserDto): Promise<{ access_token: string }>{
        const user = await this.userService.signIn(loginUserDto)
        if(!user){
            throw new BadRequestException('User login failed')
        }
        const { password : _, ...payload } = user
        return {
            access_token :await this.jwtStrategy.generateJwt(payload)
        }
    }

    async googleSignIn(user: any): Promise<{ user: User; access_token: string }> {
    if (!user) {
        throw new BadRequestException('No user from google');
    }

    const { password: _, ...payload } = user;
    const jwt = await this.jwtStrategy.generateJwt(payload);

    return {
        user,
        access_token: jwt
    };
}
    async requestPasswordReset({email} : EmailCheckDto){
      return await this.redisClient.requestPasswordReset({email})
    }
    async resetPassword(userId : any, {newPassword} : PasswordCheckDto){
       return await this.redisClient.resetPassword(userId,{newPassword})
    }

}