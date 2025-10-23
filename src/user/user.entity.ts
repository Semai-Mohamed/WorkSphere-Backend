import { Conversation } from "src/conversation/entity/conversation.entity";
import { Message } from "src/conversation/entity/message.entity";
import { AuthProvider, UserRole } from "src/dto/user.dto";
import { Notification } from "src/notification/notification.entity";
import { Offre } from "src/offer/offer.entity";
import { Portfolio } from "src/portfolio/portfolio.entity";
import { Project } from "src/project/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



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

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL
    })
    provider: AuthProvider;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true ,default : false})
    isEmailConfirmed? : boolean

    @Column({
       type: 'enum',
       enum: UserRole,
      default: UserRole.CLIENT
       })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @JoinColumn()
    @OneToOne(() => Portfolio, (portfolio) => portfolio.user, { onDelete: 'CASCADE' ,eager : true})
    portfolio: Portfolio;

    @OneToMany(() => Project, project => project.user,{ eager: true })
    projects: Project[];
     
    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @OneToMany(() => Conversation, conversation => conversation.creator)
    createdConversations: Conversation[];

    @OneToMany(() => Conversation, conversation => conversation.participant)
    participatedConversations: Conversation[];

    @OneToMany(() => Message, message => message.creator)
    createdmessages: Message[];

    @OneToMany(() => Message, Message => Message.participant)
    participatedmessages: Message[];

    @OneToMany(() => Offre, offre => offre.user, { eager: true })
    createdOffres: Offre[];

    @ManyToMany(() => Offre, offre => offre.enroledUsers, { eager: true })
    enrolledOffres: Offre[];

}
