import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';
import { PostCreateDto } from './post-create.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @Get()
  // findAll() {
  //   return this.postsService.findAll();
  // }
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  createPost(@Body() postData: PostCreateDto) {
    return this.postsService.createPost(postData);
  }
}
