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
  @Get(':id')
  getUsers(
    @Headers() headers: Record<string, unknown>,
    @Param('id', ParseIntPipe) id: GetUserParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    // @Query('available', ParseBoolPipe) available: boolean,
  ) {
    return this.usersService.findAll(id, limit, offset);
  }

  @Post()
  createUser(@Body() request: UsersCreateDto) {
    return `${request.email} ${request.firstName} ${request.lastName} ${request.password} has been created!`;
  }
}
