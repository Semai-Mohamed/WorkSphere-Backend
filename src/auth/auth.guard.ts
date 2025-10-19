/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtService : JwtService,
        private configService : ConfigService
    ){}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request : Request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if(!token){
            throw new UnauthorizedException()
        }
        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret : this.configService.get<string>('JWT_SECRET'),
            })
            request['user'] = payload
        } catch {
                  throw new UnauthorizedException();
        }
        return true

    }
    private extractTokenFromHeader(request:Request) : string | undefined {
        const [type,token] = request.headers.authorization?.split(' ')?? []
        return type === 'Bearer' ? token : undefined
    }
}