// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   Param,
//   Post,
//   Query,
//   Redirect,
// } from '@nestjs/common';

// import { CatsService } from './cats.service';
// import { CreateCatDto } from './create-cat-dto';

// @Controller('cats')
// export class CatController {
//   // dep injection
//   constructor(private readonly catsService: CatsService) {}
//   // @Redirect('https://nestjs.com', 301) // redirects to the given url with status code

//   // @Get()
//   // getCats() {
//   //   return this.catsService.findAll();
//   // }
//   @Post()
//   // @HttpCode(204) // you can change it here although it has consequences
//   create(@Body() createCatDTO: CreateCatDto): string {
//     return JSON.stringify(createCatDTO);
//   }

//   @Get(':id') // cats/3
//   findOne(@Param() params: { id: string }): string {
//     console.log(params?.id);
//     return `This action returns a #${params?.id} cat`;
//   }

//   @Get('abcd/*') // cats/abcd/asdadsa
//   findAll() {
//     return 'This route uses a wildcard';
//   }

//   @Get() // GET /cats?age=2&breed=Persian
//   async findAllByQuery(
//     @Query('age') age: number,
//     @Query('breed') breed: string,
//   ) {
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
//   }
// }

import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './create-cat-dto';
import { CatsService } from './cats.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('cats')
@ApiTags('Cats')
export class CatsController {
  // constructor(private readonly catService: CatsService) {} Standard
  constructor(
    @Inject('CatsServicer') private readonly catService: CatsService,
  ) {}
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    console.log(createCatDto);
    return this.catService.findAll();

    // return 'This action adds a new cat';
  }

  @Get(':author')
  tester(
    @Param() params: { author: string },
    @Query('limit') limit: number,
    @Query('offset') offset: string,
  ) {
    // const data = await this.catService.findAll();
    // return data;

    return `called by ${params.author} ${limit} and ${offset}`;
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get('hello')
  findAlll(@Res() res: Response) {
    // Library-specific approach
    return res.status(HttpStatus.OK).json({ message: 'Hello World!' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
    // return this.catsService.findOne(id);
  }
}
// Nite: some methods are async, so they should return a promise or you use their result.

// Even with the CatsController fully defined, Nest doesn't yet know about it and won't automatically create an instance of the class.

// Controllers must always be part of a module, which is why we include the controllers array within the @Module() decorator. Since we haven’t defined any other modules apart from the root AppModule, we’ll use it to register the CatsController:
