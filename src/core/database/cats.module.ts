import { Module } from '@nestjs/common';

import { CatsService } from './cats.service';

import { DatabaseModule } from '../database/database.module';
import { catsProviders } from './cats.provider';
import { CatController } from './cats.controller';

@Module({
  // imports: [DatabaseModule],
  controllers: [CatController],
  providers: [CatsService, ...catsProviders],
})
export class CatsModule {}
