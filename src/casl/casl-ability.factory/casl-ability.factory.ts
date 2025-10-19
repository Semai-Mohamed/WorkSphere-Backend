/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "node_modules/@nestjs/common";
import { Article } from "src/dto/aricle.dto";
import { CreateUserDto } from "src/dto/user.dto";
import { AbilityBuilder,   AbilityTuple,   createMongoAbility,  ExtractSubjectType,  InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { Action } from "../action";
import { UserRole } from "src/user/user.entity";

type Subjects = InferSubjects<typeof Article | typeof CreateUserDto> | 'all '
export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CreateUserDto) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'all')
    } else {
      can(Action.Read, 'all')
    }

    can(Action.Update, Article, { authorId: user.id });
    cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
