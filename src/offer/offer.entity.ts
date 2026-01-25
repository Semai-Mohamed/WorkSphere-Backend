import { Status } from 'src/dto/offer.service.dto';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

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

  @Column('text', { array: true })
  category: string[];

  @Column('text', { array: true })
  technologies: string[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.NOTAPPROVED,
  })
  status: Status;

  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => User, (user) => user.enrolledOffres)
  @JoinTable()
  enroledUsers: User[];

  @ManyToOne(() => User)
  accepted: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  paymentIntentId?: string;

  @Column({ nullable: true })
  freelancerStripeAccountId?: string;

  @Column({ default: false })
  clientConfirmed: boolean;

  @Column({ default: false })
  freelancerConfirmed: boolean;
  
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
    
}
/**
 
- [Project Structure](#project-structure)
-  [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Running the Project](#running-the-project)
- [Linting & Formatting](#linting--formatting)
- [Features](#features)
- [Security & Validation](#security--validation)
- [License](#license)
API Documentation
 */