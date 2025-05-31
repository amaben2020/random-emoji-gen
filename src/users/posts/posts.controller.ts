import { Get } from '@nestjs/common';
import { PostsService } from './posts.service';

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}
