import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';
import { PostCreateDto } from './post-create.dto';
import { CreateManyPostDto } from './create-many-post.dto';

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
    console.log('Post data', postData);
    return this.postsService.createPost(postData);
  }

  @Post('create-many-posts')
  createManyPosts(@Body() manyPostsDto: CreateManyPostDto) {
    return this.postsService.createManyPosts(manyPostsDto);
  }

  @Patch(':id')
  updatePost(
    @Param('id') postId: number,
    @Body() postData: Partial<PostCreateDto>,
  ) {
    return this.postsService.updatePost(postId, postData);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }

  @Delete('soft-delete/:id')
  async softDelete(@Param('id') id: number) {
    return await this.postsService.softRemove(id);
  }
}
