/* eslint-disable @typescript-eslint/no-misused-promises */ 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}
    async signUp(createUserDto : CreateUserDto) : Promise<User> {
        const {password ,email, ...rest} = createUserDto
        if (!password) {
            throw new BadRequestException('Password is required')
        }
        const existingUser = await this.userRepository.findOne({where: {email}})
        if (existingUser) {
            throw new ConflictException('Email already exits')
        }
        const hashedPassword  = await bcrypt.hash(password, 10)
        const user = this.userRepository.create({
            ...rest,
            email,
            password : hashedPassword
        })
        const savedUser =  await this.userRepository.save(user)
        if(!savedUser) {
            throw new BadRequestException('User could not be created')
        }
        return savedUser
    }

    async signIn(loginUserDto : LoginUserDto) : Promise<User> {
        const {email , password} = loginUserDto
        const user = await this.userRepository.findOne({where : {email}})
        if(!user || !user.password){
            throw new UnauthorizedException('Invalid email or password')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid password')
        }
        const {password : _ , ...result} = user
        return result as User 

    }

   

}