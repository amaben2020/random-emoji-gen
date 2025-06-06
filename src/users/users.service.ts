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
import { CreateUserDto } from './users-create.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private hashProviderService: HashingProvider,

    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const hashPassword = await this.hashProviderService.hashPassword(
      createUserDto.password,
    );

    return this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  public async findAll(limit: number, offset: number) {
    try {
      let users = undefined;
      // wrap in try catch any db requests
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

  public async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`User with EMAIL ${email} not found`);
    }
  }
}
