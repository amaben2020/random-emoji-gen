import { Module } from '@nestjs/common';
import { SendController } from './send.controller';
import { SendService } from './send.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [SendController],
  providers: [SendService],
  imports: [TransactionsModule, WalletModule],
})
export class SendModule {}
