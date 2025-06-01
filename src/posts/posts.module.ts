import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';

@Module({
  exports: [PostsService], // 👈🏾 crucial
  imports: [TypeOrmModule.forFeature([Post]), MetaOptionsModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
