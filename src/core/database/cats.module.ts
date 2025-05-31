import { Global, Module } from '@nestjs/common';

import { CatsService } from './cats.service';

import { DatabaseModule } from '../database/database.module';
import { catsProviders } from './cats.provider';
import { CatsController } from './cats.controller';

@Global()
@Module({
  // imports: [DatabaseModule],
  controllers: [CatsController],
  providers: [
    {
      provide: 'CatsServicer',
      useClass: CatsService,
    },
    ...catsProviders,
  ],
})
export class CatsModule {}
