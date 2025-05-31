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
  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    console.log("exception['message']", exception);

    return response.json({
      message:
        isHttpException && Array.isArray((exception as any).message)
          ? ((exception as HttpException).getResponse() as any).message[0]
          : isHttpException
            ? (exception as HttpException).message
            : 'Internal Server Error',
      statusCode: isHttpException
        ? (exception as HttpException).getStatus()
        : 500,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
