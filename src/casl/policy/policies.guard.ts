/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "node_modules/@nestjs/common";
import { Reflector } from "node_modules/@nestjs/core";
import { AppAbility, CaslAbilityFactory } from "../casl-ability.factory/casl-ability.factory";
import { PolicyHandler } from "./policy.handler";
import { CHECK_POLICIES_KEY } from "./policy.metadata";
import { RequestWithUser } from "src/dto/auth.dto";
import { IS_PUBLIC_KEY } from "src/auth/auth.metadata";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor (
        private reflector : Reflector,
        private caslAbilityFactory : CaslAbilityFactory,
    ){}
    canActivate(context: ExecutionContext): boolean {
        const policyHandler = this.reflector.get<PolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) || []
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
                    context.getHandler(),
                    context.getClass(),
            ]);
        if (isPublic) return true
        const {user} : RequestWithUser = context.switchToHttp().getRequest()
        const ability = this.caslAbilityFactory.createForUser(user)
        
        return policyHandler.every((handler) =>
          this.execPolicyHandler(handler,ability)
        )
    }

    private execPolicyHandler(handler : PolicyHandler, ability : AppAbility){
        if(typeof handler === "function"){ // لازم نزيد getErrorMessage اذا ستحقينها
            return handler(ability)
        }
        if(!handler.handle(ability)){
            throw new ForbiddenException(handler.getErrorMessage())
        }
        return true
        
    }
}