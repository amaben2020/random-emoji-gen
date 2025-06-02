import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { UsersCreateDto } from '../users-create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private postService: PostsService,
  ) {}

  public createUser(createUserDto: UsersCreateDto) {
    return this.userRepository.save(createUserDto);
  }
  public findAll(limit: number, offset: number) {
    try {
      // return `This action returns all users  ${limit} ${offset}`;
      // const posts = this.postService.findAll();
      // console.log('Posts', posts);
      return this.userRepository.find();
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
