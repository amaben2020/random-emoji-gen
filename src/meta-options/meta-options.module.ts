import { Module } from '@nestjs/common';
import { MetaOptionsService } from './meta-options.service';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-options.entity';

@Module({
  providers: [MetaOptionsService],
  controllers: [MetaOptionsController],
  exports: [MetaOptionsService],
  imports: [TypeOrmModule.forFeature([MetaOption])],
})
export class MetaOptionsModule {}
