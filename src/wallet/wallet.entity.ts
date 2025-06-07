import { User } from 'src/users/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, {})
  user: User;

  // TODO: Create transaction relation
}
