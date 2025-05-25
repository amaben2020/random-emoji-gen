import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('LIFECYLCE 1: MIDDLEWARE');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(`Incoming request method: ${req.method}, url: ${req.url}`);

    // if (req.method === 'GET') {
    //   throw new Error('Not allowed');
    // }
    next();
  }
}

// Note: middleware are functions that execute before route handlers, providing a way to intercept and process requests before they reach the route handlers. They can be used for tasks like logging, authentication, validation, and more.
