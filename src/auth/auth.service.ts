import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './auth-signin.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hashProviderService: HashingProvider,
  ) {}
  public async signIn(data: SignInDto) {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new NotFoundException(`User with ${data.email} does not exist.`);
    }

    const isPasswordsMatch = await this.hashProviderService.comparePasswords(
      data.password,
      user.password,
    );

    if (!isPasswordsMatch) {
      throw new BadRequestException(`Invalid credentials`);
    }
    return user;
  }
}
