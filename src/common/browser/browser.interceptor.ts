/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.header('user-agent');
    const browserClient = userAgent ? userAgent : 'Unknown';
    const connection = request.connection.remoteAddress;
    console.log(`IP: ${connection}`);
    console.log(`BROWSER: ${browserClient}`);
    return next.handle();
  }
}
