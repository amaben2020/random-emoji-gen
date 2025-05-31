import {
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUsers(
    @Headers() headers: Record<string, unknown>,
    @Param('id', ParseIntPipe) id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
  ) {
    return `id: ${id}, limit: ${limit}, offset: ${offset}`;
  }

  @Get()
  findAll(): string[] {
    return ['123'];
  }
}
