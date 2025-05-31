import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersCreateDto } from './users-create.dto';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUsers(
    @Headers() headers: Record<string, unknown>,
    @Param('id', ParseIntPipe) id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('available', ParseBoolPipe) available: boolean,
  ) {
    return `id: ${id}, limit: ${limit}, offset: ${offset} available: ${available}`;
  }

  @Post()
  createUser(@Body() request: UsersCreateDto) {
    return `${request.email} ${request.firstName} ${request.lastName} ${request.password} has been created!`;
  }
}
