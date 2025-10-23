import { Injectable } from "node_modules/@nestjs/common";
import { Response } from "node_modules/@types/express";

@Injectable()
export class CookiesStrategy {
    constructor(){}
    setAccessToken(res : Response,accessToken:string | undefined){
        if(!accessToken){
            throw new Error()
        }
        res.cookie('accessToken',accessToken,{
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 3600
    })}

    setRefreshToken(res : Response,refreshToken:string | undefined){
        if(!refreshToken){
            throw new Error()
        }
        res.cookie('refreshToken',refreshToken,{
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 3600 * 24 * 7
        })}
    
}
    