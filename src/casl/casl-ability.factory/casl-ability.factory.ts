/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable } from 'node_modules/@nestjs/common';
import { CreateUserDto, UserRole } from 'src/dto/user.dto';
import {
  AbilityBuilder,
  AbilityTuple,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { User } from 'src/user/user.entity';
import { Project } from 'src/project/project.entity';
import { Offre } from 'src/offer/offer.entity';
import { Message } from 'src/conversation/entity/message.entity';
import { Conversation } from 'src/conversation/entity/conversation.entity';
import { Status } from 'src/dto/offer.service.dto';
import { Portfolio } from 'src/portfolio/portfolio.entity';
import { Notification } from 'src/notification/notification.entity';

type Subjects =
  | InferSubjects<
      | typeof Project
      | typeof User
      | typeof Offre
      | typeof Portfolio
      | typeof Notification
      | typeof Conversation
      | typeof Message
    >
  | 'all ';
export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CreateUserDto) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    can('read', Project);
    can('read', User);
    can('read', Offre);
    can('read', Portfolio);
    can('read', Conversation, {
      $or: [{ creator: { id: user.id } }, { participant: { id: user.id } }],
    } as any);
    can('read', Message, {
      $or: [{ creator: { id: user.id } }, { participant: { id: user.id } }],
    } as any);
    can('create', Portfolio);
    can('update', Portfolio, { 'user.id': user.id } as any);
    can('update', User, { id: user.id });

    cannot('delete', Offre, {
      status: { $ne: Status.NOTAPPROVED },
    } as MongoQuery<Offre>);
    cannot('update', Offre, {
      status: { $ne: Status.NOTAPPROVED },
    } as MongoQuery<Offre>);
    if (user.role === UserRole.ADMIN) {
      can('manage', Project);
      can('manage', Offre);
      can('manage', User, { role: { $ne: 'admin' } } as MongoQuery<User>);
    } else if (user.role === UserRole.FREELANCER) {
      can('create', Project);
      can('update', Project, { 'user.id': user.id } as any);
      can('delete', Project, { 'user.id': user.id } as any);
      can('enrol', Offre, ['enroledUsers'] as any);
      can ('create',Message)

    } else if (user.role === UserRole.CLIENT) {
      can('update', Offre, { 'user.id': user.id } as any);
      can('create', Offre);
      can('delete', Offre, { 'user.id': user.id } as any);
      can ('create',Conversation)
      can ('create',Message)
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
