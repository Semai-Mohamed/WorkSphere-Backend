import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User,)
  creator: User;
  
  @JoinColumn()
  @ManyToOne(() => User,{  onDelete: 'CASCADE' } )
  participant: User;

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];
}
