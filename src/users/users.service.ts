import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { UsersCreateDto } from './users-create.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // @Inject(forwardRef(() => PostsService))
    // private postService: PostsService,

    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public createUser(createUserDto: UsersCreateDto) {
    return this.userRepository.save(createUserDto);
  }
  public async findAll(limit: number, offset: number) {
    try {
      // return `This action returns all users  ${limit} ${offset}`;
      // const posts = this.postService.findAll();
      // console.log('Posts', posts);
      // console.log(
      //   'Environment variable DB_HOST',
      //   this.configService.get<string>('DB_HOST'),
      // );

      // console.log('API KEY', this.profileConfiguration.apiKey);
      // console.log('node env', process.env.NODE_ENV);

      let users = undefined;
      // wrap in trycatch any db requests
      try {
        users = await this.userRepository.find({
          relations: {
            posts: true,
          },
        });
      } catch (error) {
        console.log(error);
        throw new RequestTimeoutException(
          'Unable to connect to db and process request. Please try again later.',
          {
            description:
              'Unable to connect to db and process request. Please try again later.',
          },
        );
      }
      // throw exception in the catch block
      // return the variable
      return users;
    } catch (error) {
      console.log(error || 'Something went wrong');
    }
  }

  public async findOneById(id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`User with ID ${id} not found`);
    }
  }
}
