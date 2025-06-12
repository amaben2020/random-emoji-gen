import { Transform } from 'class-transformer';
import { Wallet } from '../wallet/wallet.entity';
// always confirm its from typeorm and not sequelize
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  title: string;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }: { value: Date | null | undefined }) =>
    value?.toISOString(),
  )
  updatedAt!: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }: { value: Date | null | undefined }) =>
    value?.toISOString(),
  )
  createdAt!: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: Wallet;
}
