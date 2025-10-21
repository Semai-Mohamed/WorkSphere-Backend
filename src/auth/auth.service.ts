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


@Injectable()
export class AuthService {
    constructor(
        private userService : UserService,
        private jwtStrategy : JwtStrategy,
        private googleStrategy : GoogleStrategy

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

    async googleSignIn(){
        

    }

}