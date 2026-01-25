/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from 'node_modules/@nestjs/common';
import { ConfigService } from 'node_modules/@nestjs/config';
import { JwtService } from 'node_modules/@nestjs/jwt';
import { Request } from 'node_modules/@types/express';
@Injectable()
export class JwtStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwt(
    payload: Record<string, unknown>,
    expiresIn: any = '1h',
  ): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      algorithm: 'HS256', // explicitly set
    });

  }
  async verifyJwt(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return await this.jwtService.verifyAsync(token, { secret });
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const token = request?.cookies?.['accessToken'];
    if (!token) return undefined;

    return Array.isArray(token) ? token[0] : token;
  }
}
