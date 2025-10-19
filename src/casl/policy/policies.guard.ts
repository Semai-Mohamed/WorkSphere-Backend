/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from "node_modules/@nestjs/common";
import { Reflector } from "node_modules/@nestjs/core";
import { AppAbility, CaslAbilityFactory } from "../casl-ability.factory/casl-ability.factory";
import { PolicyHandler } from "./policy.handler";
import { CHECK_POLICIES_KEY } from "./policy.metadata";
import { RequestWithUser } from "src/dto/auth.dto";
@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor (
        private reflector : Reflector,
        private caslAbilityFactory : CaslAbilityFactory,
    ){}
    canActivate(context: ExecutionContext): boolean {
        const policyHandler = 
        this.reflector.get<PolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) || []
        const {user} : RequestWithUser = context.switchToHttp().getRequest()
        const ability = this.caslAbilityFactory.createForUser(user)
        
        return policyHandler.every((handler) =>
          this.execPolicyHandler(handler,ability)
        )
    }

    private execPolicyHandler(handler : PolicyHandler, ability : AppAbility){
        if(typeof handler === "function"){
            return handler(ability)
        }
        return handler.handle(ability)
    }
}