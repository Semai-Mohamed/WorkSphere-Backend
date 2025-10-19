/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import type { RequestWithUser } from 'src/dto/auth.dto';
import { Public } from './auth.metadata';


@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService,
    ){}
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signUp')
    signUp(@Body(ValidationPipe) signUpDto : CreateUserDto ){
      return this.authService.signUP(signUpDto)
    }

    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('signIn')
    signIn(@Body(ValidationPipe) signInDto : LoginUserDto){
      return this.authService.signIn(signInDto)
    }

    @Get('profile')
    getProfile(@Req() req : RequestWithUser){
      return req.user
    }
}