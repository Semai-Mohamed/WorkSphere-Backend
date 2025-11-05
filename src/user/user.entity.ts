import { AuthProvider, UserRole } from 'src/dto/user.dto';
import { Offre } from 'src/offer/offer.entity';
import { Portfolio } from 'src/portfolio/portfolio.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, default: false })
  isEmailConfirmed?: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ type: 'varchar', default: null })
  stripeAccountId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  portfolio: Portfolio;

  @ManyToMany(() => Offre, (offre) => offre.enroledUsers, { eager: true })
  enrolledOffres: Offre[];
}
