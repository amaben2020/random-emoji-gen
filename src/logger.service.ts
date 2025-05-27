import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  message: string;

  log(message: string) {
    console.log(`INFO: [${message}}]`);
  }
}
