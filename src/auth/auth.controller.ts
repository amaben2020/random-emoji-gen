import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './auth-signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard.guard';
import { Public } from './decorator/auth.decorator';
import { AdminDecorator } from './admin-decorator.decorator';
import { AdminGuard } from './admin-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard)
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AdminGuard)
  @AdminDecorator('admin')
  @Get('test')
  public test(): string {
    return 'hello';
  }
}
