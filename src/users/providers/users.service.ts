import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public findAll(limit: number, offset: number) {
    try {
      return `This action returns all users  ${limit} ${offset}`;
    } catch (error) {
      console.log(error || 'Something went wrong');
    }
  }

  public findOneById(id: number) {
    try {
      return `This action returns a #${id} user`;
    } catch (error) {
      console.log(error || 'Something went wrong');
    }
  }
}
