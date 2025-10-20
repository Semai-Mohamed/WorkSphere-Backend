import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  checked: boolean;

  @Column({ type: 'varchar', length: 255 })
  purpose: string;

  // Many notifications belong to one user
  @ManyToOne(() => User, user => user.notifications, { eager: true })
  user: User;
}
