import { Injectable } from '@nestjs/common';
import { SignInDto } from './auth-signin.dto';

@Injectable()
export class AuthService {
  public async signIn(data: SignInDto): Promise<string> {
    return await '';
  }
}
