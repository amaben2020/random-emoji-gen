import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  // ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserParamDto, UsersCreateDto } from './users-create.dto';

import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Headers() headers: Record<string, unknown>,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
  ) {
    console.log(headers);
    return this.usersService.findAll(limit, offset);
  }
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Post()
  createUser(@Body() request: UsersCreateDto) {
    return `${request.email} ${request.firstName} ${request.lastName} ${request.password} has been created!`;
  }
}
