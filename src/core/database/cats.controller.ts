import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';

import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat-dto';

@Controller('cats')
export class CatController {
  // dep injection
  constructor(private readonly catsService: CatsService) {}
  // @Redirect('https://nestjs.com', 301) // redirects to the given url with status code

  // @Get()
  // getCats() {
  //   return this.catsService.findAll();
  // }
  @Post()
  // @HttpCode(204) // you can change it here
  create(@Body() createCatDTO: CreateCatDto): string {
    return JSON.stringify(createCatDTO);
  }

  @Get(':id') // cats/3
  findOne(@Param() params: { id: string }): string {
    console.log(params?.id);
    return `This action returns a #${params?.id} cat`;
  }

  @Get('abcd/*') // cats/abcd/asdadsa
  findAll() {
    return 'This route uses a wildcard';
  }
}
