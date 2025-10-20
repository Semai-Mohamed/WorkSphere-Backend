/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Conversation } from "src/conversation/entity/conversation.entity";
import { Message } from "src/conversation/entity/message.entity";
import { Notification } from "src/notification/notification.entity";
import { Project } from "src/project/project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  CLIENT= 'client',
  FREELANCER = 'freelancer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    firstName : string

    @Column()
    lastName : string

    @Column()
    email : string

    @Column()
    mobile : string

    @Column()
    password : string

    @Column({ nullable: true })
    googleId? : string

    @Column({
       type: 'enum',
       enum: UserRole,
       })
    role: UserRole;

    @Column({ nullable: true })
    photo? : string
    
    @Column({ nullable: true })
    description? : string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Project, project => project.user)
    projects: Project[];
     
    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];


    @OneToMany(() => Conversation, conversation => conversation.creator)
    createdConversations: Conversation[];

    @OneToMany(() => Conversation, conversation => conversation.participant)
    participatedConversations: Conversation[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

}