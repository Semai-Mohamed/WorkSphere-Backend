import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, })
  link: string;

  @Column({ type: 'varchar', length: 255,})
  photo: string;

  @Column({ type: 'array', length: 100, })
  category: string[];

  @Column({ type: 'array', })
  technologies: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.projects, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
