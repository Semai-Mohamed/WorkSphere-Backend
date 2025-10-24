
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Reflector } from "node_modules/@nestjs/core";
import { IS_PUBLIC_KEY } from "./auth.metadata";
import { JwtStrategy } from "./strategies/token.strategy/jwt.strategy";
import Redis from "node_modules/ioredis/built";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private configService : ConfigService,
        private reflector: Reflector,
        private jwtStrategy : JwtStrategy,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ){}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
    ]);
    if(isPublic){
        return true
    }  
        const request : Request = context.switchToHttp().getRequest()
        const token = this.jwtStrategy.extractTokenFromHeader(request)
        const isRevoked = await this.redisClient.get(`revoked:${token}`);
        if (isRevoked) throw new UnauthorizedException('Token revoked');
        if(!token){
            throw new UnauthorizedException()
        }
        try {

            const payload = await this.jwtStrategy.verifyJwt(token)

            request['user'] = payload
        } catch (err)
         { 
                  throw new UnauthorizedException(err);
        }
        return true

    }
    
}