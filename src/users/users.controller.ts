import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  // ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './users-create.dto';

import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/auth.decorator';

@Controller('users')
@ApiTags('Users')
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

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.usersService.createUser(body);
    // return `${request.email} ${request.firstName} ${request.lastName} ${request.password} has been created!`;
  }
}
