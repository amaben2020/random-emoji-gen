import { Inject, Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password as string, salt);
  }

  async comparePasswords(
    password: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(password as string, hashedPassword);
    return isValid;
  }
}
