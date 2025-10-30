/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "node_modules/@nestjs/common";
import { Reflector } from "node_modules/@nestjs/core";
import {  CaslAbilityFactory } from "../casl-ability.factory/casl-ability.factory";
import { CHECK_ABILITY_KEY } from "./policy.metadata";
import { RequestWithUser } from "src/dto/auth.dto";
import { IS_PUBLIC_KEY } from "src/auth/auth.metadata";
import { DataSource } from "node_modules/typeorm";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor (
        private reflector : Reflector,
        private caslAbilityFactory : CaslAbilityFactory,
        private dataSource : DataSource,
    ){}
    async canActivate(context: ExecutionContext) : Promise<boolean> {
        const { action, subject , fieldName } = this.reflector.get(CHECK_ABILITY_KEY, context.getHandler()) || {};
        if (!action || !subject) return true;
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
                    context.getHandler(),
                    context.getClass(),
            ]);
        if (isPublic) return true
        const req : RequestWithUser = context.switchToHttp().getRequest()
        const { user } = req
        const id = req.params.id
        const ability = this.caslAbilityFactory.createForUser(user)
        
        const repository = this.dataSource.getRepository(subject)
        if (subject.name === 'User') {return true}
        const entity =await repository.findOne({ where: { id } ,relations : ['user']}) ? await repository.findOne({ where: { id } ,relations : ['user']}) : subject;
       
        let canAccess :any
        if(!fieldName) canAccess = ability.can(action, entity)
        else canAccess = ability.can(action,entity,fieldName )
         if (!canAccess) {           
           throw new ForbiddenException(`You cannot ${action} this ${subject.name}`);
       }
    
       return true
    }
}
