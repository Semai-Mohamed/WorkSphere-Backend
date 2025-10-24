/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import type { EmailCheckDto, PasswordCheckDto, RequestWithUser } from 'src/dto/auth.dto';
import { Public } from './auth.metadata';
import { AuthGuard } from 'node_modules/@nestjs/passport';
import type { Request, Response } from 'node_modules/@types/express';
import { RedisGuard } from './strategies/redis.strategy/redis.guard';
import { Cookies } from '../common/cookies.decorator';


@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService,
    ){}
    
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signUp')
    signUp(@Body() signUpDto : CreateUserDto ){
      return this.authService.signUP(signUpDto)
    }

    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('signIn')
    signIn(@Body() signInDto : LoginUserDto, @Res({ passthrough: true }) res : Response){
      return this.authService.signIn(signInDto,res)
    }

    @Public()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    
    }

    @Public()
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
   async googleAuthRedirect(@Req() req : Request,@Res({ passthrough: true }) res : Response) {
    return this.authService.googleSignIn(res,req.user);
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
    
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Req() req: RequestWithUser, @Cookies('refreshToken') accessToken: string,@Res({ passthrough: true }) res : Response){
      return  await this.authService.refreshAccessToken(req,accessToken,res)
      
    }


    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Cookies('accessToken') accessToken : string) {
      await this.authService.logOut(accessToken);
      return { message: 'Logged out successfully' };
}

    @Get('profile')
    getProfile(@Req() req : RequestWithUser){
      return req.user
    }
}