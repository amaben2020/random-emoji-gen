import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

import { MetaOption } from 'src/meta-options/meta-options.entity';

@Module({
  exports: [PostsService], // 👈🏾 crucial
  imports: [TypeOrmModule.forFeature([Post, MetaOption])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
