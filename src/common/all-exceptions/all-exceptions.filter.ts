import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch() // with empty args means all errors
// @Catch(HttpException) // defaults to NestJS default error handling FOR THIS FILTER ONLY
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    return response.json({
      message: isHttpException ? exception['message'] : 'Internal Server Error',
      statusCode: isHttpException ? exception.getStatus() : 500,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
