/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "node_modules/@nestjs/common";
import { CreateUserDto, UserRole } from "src/dto/user.dto";
import { AbilityBuilder,   AbilityTuple,   createMongoAbility,  ExtractSubjectType,  InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { User } from "src/user/user.entity";
import { Project } from "src/project/project.entity";
import { Offre } from "src/offer/offer.entity";
import { Message } from "src/conversation/entity/message.entity";
import { Conversation } from "src/conversation/entity/conversation.entity";
import { Status } from "src/dto/offer.service.dto";
import { Portfolio } from "src/portfolio/portfolio.entity";

type Subjects = InferSubjects<typeof Project | typeof User> | 'all '
export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CreateUserDto) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  can('read', Project);
  can('read', Offre);
  can('read', Portfolio);
  can('read', Conversation, {
    $or: [
      { creator: { id: user.id } },
      { participant: { id: user.id } },
    ],
  } as MongoQuery<Conversation>);
  can('read', Message, {
    $or: [
      { creator: { id: user.id } },
      { participant: { id: user.id } },
    ],
  } as MongoQuery<Message>);
  can('create', Portfolio);
  can('update', Portfolio, { user: { id: user.id } });

  cannot('delete', Offre, { status: {$ne: Status.NOTAPPROVED }} as MongoQuery<Offre>);
  cannot('update', Offre, { status: {$ne: Status.NOTAPPROVED }} as MongoQuery<Offre>);
  if (user.role === UserRole.ADMIN) {
    can('manage', Project);
    can('manage', Offre);
    can('manage', User, { role: { $ne: 'admin' } } as MongoQuery<User>);
  } 
  
  else if (user.role === UserRole.FREELANCER) {
    can('create', Project);
    can('update', Project, { user: { id: user.id } });
    can('delete', Project, { user: { id: user.id } });

    can('create', Offre);
    can('update', Offre, { user: { id: user.id } });
    can('delete', Offre, { user: { id: user.id } });

    
  } 
  
  else if (user.role === UserRole.CLIENT) {
    can('create', Offre);
    can('update', Offre, { user: { id: user.id } });
    can('delete', Offre, { user: { id: user.id } });
  }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })}}
