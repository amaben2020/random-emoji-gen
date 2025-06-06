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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hashProviderService: HashingProvider,

    private jwtService: JwtService,
  ) {}
  public async signIn(data: SignInDto) {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new NotFoundException(`User with ${data.email} does not exist.`);
    }

    const isPasswordsMatch = await this.hashProviderService.comparePasswords(
      data.password,
      user.password!,
    );

    if (!isPasswordsMatch) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      userName: user.firstName + ' ' + user.lastName,
    };
    return {
      ...user,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
