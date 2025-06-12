import { Exclude } from 'class-transformer';
import { Post } from '../posts/post.entity';
import { Wallet } from '../wallet/wallet.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserType {
  MERCHANT = 'merchant',
  CLIENT = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 90,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 90,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 90,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 90,
    nullable: false,
  })
  @Exclude()
  password?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '',
  })
  accountNumber?: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
  })
  type?: UserType;

  // TODO: Wallet relation
  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  wallet?: Wallet;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}
