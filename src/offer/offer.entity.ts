import { Type } from 'src/dto/offer.service.dto';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

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
  numEnrolled: number;

  @Column({ type: 'enum', enum: Type })
  role: Type;

  @ManyToOne(() => User,user => user.createdOffres)
  freelancer: User;

  @ManyToMany(() => User, user => user.enrolledOffres)
  @JoinTable() 
  enroledUsers: User[];
}
