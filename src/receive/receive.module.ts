import { Module } from '@nestjs/common';
import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';
import { UnitOfWorkModule } from 'src/unit-of-work/unit-of-work.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  providers: [ReceiveService],
  controllers: [ReceiveController],
  imports: [UnitOfWorkModule, WalletModule, TransactionsModule],
})
export class ReceiveModule {}
