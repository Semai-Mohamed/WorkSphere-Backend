import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookiesStrategy {
  
  setAccessToken(res: Response, accessToken: string | undefined) {
    if (!accessToken) throw new InternalServerErrorException('AccessToken missing');

    res.cookie('accessToken', accessToken, {
      httpOnly: true,      
      secure: true,         
      sameSite: 'lax',     
      path: '/',            
      maxAge: 3600 * 1000,
    });
  }

  setRefreshToken(res: Response, refreshToken: string | undefined) {
    if (!refreshToken) throw new InternalServerErrorException('RefreshToken missing');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,         
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 24 * 7 * 1000,
    });
  }
}