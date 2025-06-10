import { Module } from '@nestjs/common';
import { VtpassController } from './vtpass.controller';
import { VtpassService } from './vtpass.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { vtPassConfig } from './config/vtPassConfig';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  controllers: [VtpassController],
  providers: [VtpassService],
  imports: [
    WalletModule,
    ConfigModule.forFeature(vtPassConfig),
    TransactionsModule,
  ],
})
export class VtpassModule {}
