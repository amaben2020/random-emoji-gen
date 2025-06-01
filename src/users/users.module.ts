import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // Enables us inject the service in other modules i.e User repository
  imports: [PostsModule, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
