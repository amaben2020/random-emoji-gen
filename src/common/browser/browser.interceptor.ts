/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('LIFECYLCE 3: INTERCEPTOR BEFORE HANDLER');
    const request: Request = context.switchToHttp().getRequest(); // Get the HTTP request object

    const userAgent = request.headers['user-agent']; // Extract user agent information from headers

    const formattedUserAgent = userAgent?.replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphanumeric characters except spaces

    console.log(`Browser Interceptor - User Agent: ${formattedUserAgent}`);

    request.headers.browser = formattedUserAgent; // Add browser information as a header for further processing

    return next.handle();
  }
}
