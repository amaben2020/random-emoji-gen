import { Module } from '@nestjs/common';
import { UsersService } from '../providers/users.service';

@Module({
  exports: [],
  imports: [],
  providers: [UsersService],
})
export class PostsModule {}
