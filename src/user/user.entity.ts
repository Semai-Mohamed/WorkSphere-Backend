import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  CLIENT= 'client',
  FREELANCER = 'freelancer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    firstName : string

    @Column()
    lastName : string

    @Column()
    email : string

    @Column()
    mobile : string

    @Column()
    password : string

    @Column({ nullable: true })
    googleId? : string

    @Column({
       type: 'enum',
       enum: UserRole,
       })
    role: UserRole;

    @Column({ nullable: true })
    photo? : string

    @Column()
    blocked : boolean
    
    @Column({ nullable: true })
    description? : string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}