import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './auth-signin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-in')
  public async signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }
}
