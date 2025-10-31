import { Conversation } from 'src/conversation/entity/conversation.entity';
import { Status, Type } from 'src/dto/offer.service.dto';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Offre {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 255 })
  service: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  price: string;

  @Column({ type: 'int', default: 0 })
  enrolledCount: number;

  @Column({ type: 'enum', enum: Type })
  type: Type;
  
  @Column('text', { array: true })
  category: string[];

  @Column('text', { array: true })
  technologies: string[];
  
  @Column({
      type: 'enum',
      enum: Status,
      default: Status.NOTAPPROVED
           })
  status: Status;

  @JoinColumn()
  @ManyToOne(() => User,{  onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => User, user => user.enrolledOffres)
  @JoinTable() 
  enroledUsers: User[];
  
  @ManyToOne(() => User)
  accepted: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @JoinColumn()
  @OneToOne(() => Conversation , {eager : true})
  projectConversation : Conversation

  @Column({ default: false })
  clientApprovefinished: boolean;

  @Column({ default: false })
  freelancerApprovefinished: boolean;

}
