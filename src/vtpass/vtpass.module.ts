import { Module } from '@nestjs/common';
import { VtpassController } from './vtpass.controller';
import { VtpassService } from './vtpass.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { vtPassConfig } from './config/vtPassConfig';

@Module({
  controllers: [VtpassController],
  providers: [VtpassService],
  imports: [WalletModule, ConfigModule.forFeature(vtPassConfig)],
})
export class VtpassModule {}
