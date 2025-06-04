import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';

import { CreateTagDto } from './tags-create.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getTags() {
    return await this.tagsService.getTags();
  }

  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
}
