/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('LIFECYLCE 2: INIT GUARD');

    const request = context.switchToHttp().getRequest();
    console.log('AUTH GUARD STOPPED');
    const apiKey = request.headers['x-api-key'];

    // if (apiKey === 'SECRET') return true;

    return true;
  }
}
