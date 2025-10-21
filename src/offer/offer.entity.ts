import { Conversation } from 'src/conversation/entity/conversation.entity';
import { Status, Type } from 'src/dto/offer.service.dto';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne } from 'typeorm';

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
  
  @Column({ type: 'array', length: 100 })
  category: string[];

  @Column({ type: 'array'})
  technologies: string[];
  
  @Column({
      type: 'enum',
      enum: Status,
           })
  status: Status;

  @ManyToOne(() => User,user => user.createdOffres)
  user: User;

  @ManyToMany(() => User, user => user.enrolledOffres)
  @JoinTable() 
  enroledUsers: User[];
  
  @ManyToOne(() => User, { eager: true,  })
  accepted: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Conversation , {eager : true})
  projectConversation = Conversation

}
