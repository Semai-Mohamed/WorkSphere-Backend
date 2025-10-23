/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import type { EmailCheckDto, PasswordCheckDto, RequestWithUser } from 'src/dto/auth.dto';
import { Public } from './auth.metadata';
import { AuthGuard } from 'node_modules/@nestjs/passport';
import type { Request } from 'node_modules/@types/express';
import { RedisGuard } from './strategies/redis.strategy/redis.guard';


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

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('forgetPassword')
    requestPasswordReset(@Body() {email} : EmailCheckDto ){
      return this.authService.requestPasswordReset({email})
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseGuards(RedisGuard)
    @Post('resetPassword')
    resetPassword(@Req() req : Request, @Body() {newPassword} : PasswordCheckDto){
      const userId = req['userId']
      return this.authService.resetPassword(userId,{newPassword})
    }

    @Get('profile')
    getProfile(@Req() req : RequestWithUser){
      return req.user
    }
}