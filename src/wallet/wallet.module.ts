import { Module } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';

@Module({
  exports: [WalletService],
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletService],
})
export class WalletModule {}
