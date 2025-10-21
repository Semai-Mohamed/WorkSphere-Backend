/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import type { RequestWithUser } from 'src/dto/auth.dto';
import { Public } from './auth.metadata';
import { AuthGuard } from 'node_modules/@nestjs/passport';
import type { Request } from 'node_modules/@types/express';


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
    
    @Public()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    
    }

    @Public()
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
   async googleAuthRedirect(@Req() req : Request) {
    return this.authService.googleSignIn(req.user);
    }

    @Get('profile')
    getProfile(@Req() req : RequestWithUser){
      return req.user
    }
}