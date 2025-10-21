import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @JoinColumn()
  @ManyToOne(() => User, )
  creator: User;
  
  @JoinColumn()
  @ManyToOne(() => User, )
  participant: User;
  
  @JoinColumn()
  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
