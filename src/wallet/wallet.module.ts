import { Module } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletController } from './wallet.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { paystackConfig } from './config/paystackConfig';

@Module({
  exports: [WalletService],
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UsersModule,
    ConfigModule.forFeature(paystackConfig),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
