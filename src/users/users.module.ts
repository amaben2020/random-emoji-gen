import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // Enables us inject the service in other modules i.e User repository
  imports: [
    // forwardRef(() => PostsModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
  exports: [UsersService],
})
export class UsersModule {}
