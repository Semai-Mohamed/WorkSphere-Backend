import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @Column({ type: 'varchar', length: 255 })
  photo: string;

  @Column('text', { array: true })
  category: string[];

  @Column('text', { array: true })
  technologies: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
