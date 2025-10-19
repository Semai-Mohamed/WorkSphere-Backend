import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-array' })
  reserved: string[];

  @Column({ type: 'int' })
  reservedCount: number;

  @Column({ type: 'boolean', default: false })
  acceptedFreelancer: boolean;

  // Many projects belong to one user
  @ManyToOne(() => User, user => user.projects, { eager: true })
  user: User;
}
