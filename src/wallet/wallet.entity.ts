import { Transaction } from '../transactions/transactions.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, {})
  user: User;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({ type: 'varchar' })
  currency: 'NGN';

  @CreateDateColumn({ type: 'varchar' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  ref: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.wallet, {})
  @JoinTable()
  transactions: Transaction[];
}
