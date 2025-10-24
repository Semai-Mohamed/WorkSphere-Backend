import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.portfolio, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  portfolioLink?: string; 
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  
}
