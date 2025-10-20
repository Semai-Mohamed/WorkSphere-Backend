/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "node_modules/@nestjs/common";
import { CreateUserDto } from "src/dto/user.dto";
import { AbilityBuilder,   AbilityTuple,   createMongoAbility,  ExtractSubjectType,  InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { Action } from "../action";
import { User, UserRole } from "src/user/user.entity";
import { Project } from "src/project/project.entity";

type Subjects = InferSubjects<typeof Project | typeof User> | 'all '
export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CreateUserDto) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'all')
    } 
    else if (user.role === UserRole.FREELANCER) {
        can(Action.Update,Project , { user: { id: user.id } })
        can(Action.Delete,Project , { user: { id: user.id } })

        
    }

    
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
