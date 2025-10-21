import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @ManyToOne(() => User, { eager: true })
  participant: User;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
