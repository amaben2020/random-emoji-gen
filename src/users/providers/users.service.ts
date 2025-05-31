import { Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../users-create.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUsersParamDto: GetUserParamDto,
    limit: number,
    offset: number,
  ) {
    try {
      return `This action returns all users ${getUsersParamDto.id} ${limit} ${offset}`;
    } catch (error) {
      console.log(error || 'Something went wrong');
    }
  }
}
