/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // throw new Error();
    console.log('LIFECYLCE 2: INIT GUARD');

    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (apiKey === 'SECRET') return true;

    return false;
  }
}
