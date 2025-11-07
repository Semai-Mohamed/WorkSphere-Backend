/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from "node_modules/@nestjs/common";
import { ConfigService } from "node_modules/@nestjs/config";
import { WsException } from "node_modules/@nestjs/websockets";
import { Request } from "node_modules/@types/express";
import Redis from "node_modules/ioredis/built";
import { Socket } from "node_modules/socket.io/dist";
import { JwtStrategy } from "src/common/strategies/token/jwt.strategy";

@Injectable()
export class WsAuthGuard  implements CanActivate{
 constructor(
    private readonly configService : ConfigService,
    private readonly redisClient : Redis,
    private jwtStrategy : JwtStrategy

 ){}
 async canActivate(context: ExecutionContext): Promise<boolean> {  
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token : string= client.handshake.auth.token; 
    if (!token) throw new WsException('No token provided')
    const isRevoked =await this.redisClient.get(`revoked:${token}`)
    if (isRevoked) throw new WsException('Token revoked')
    
    try {
        const payload = await this.jwtStrategy.verifyJwt(token);
        (client as any).user = payload; // attach user to socket
        return true;
    } catch  {
        throw new WsException('Invalid token')
    }
 }
}