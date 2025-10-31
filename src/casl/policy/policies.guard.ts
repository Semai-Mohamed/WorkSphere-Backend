/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from 'node_modules/@nestjs/common';
import { Reflector } from 'node_modules/@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory/casl-ability.factory';
import { CHECK_ABILITY_KEY, PolicyMetadata } from './policy.metadata';
import { RequestWithUser } from 'src/dto/auth.dto';
import { IS_PUBLIC_KEY } from 'src/auth/auth.metadata';
import { DataSource } from 'node_modules/typeorm';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private dataSource: DataSource,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies: PolicyMetadata[] =
      this.reflector.get(CHECK_ABILITY_KEY, context.getHandler()) || [];
    if (!policies.length) return true;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = req;
    const id = req.params.id;
    const ability = this.caslAbilityFactory.createForUser(user);
    for (const policy of policies) {
      const { action, subject, fieldName } = policy;
      const repository = this.dataSource.getRepository(subject);
      let entity: any;
      if (subject.name === 'User') {
        entity = (await repository.findOne({ where: { id } })) || subject;
      } else {
        entity =
          (await repository.findOne({ where: { id }, relations: ['user'] })) ||
          subject;
      }
      const canAccess = fieldName
        ? ability.can(action, entity, fieldName)
        : ability.can(action, entity);
      console.log(entity);
      if (canAccess) return true;
    }

     throw new ForbiddenException(
       `You are not allowed to perform this action.`,
     );
  }
}
