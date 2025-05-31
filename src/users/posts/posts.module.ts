import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  exports: [],
  imports: [],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
