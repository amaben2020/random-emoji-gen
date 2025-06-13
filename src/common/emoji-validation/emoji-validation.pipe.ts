import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoggerService } from '../../logger.service';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  constructor(private readonly logger: LoggerService) {}
  transform(value: any) {
    this.logger.log('LIFECYCLE 4: PIPE');

    if (!value) return;

    if (value < 0 || value > 10)
      throw new BadRequestException(`Index must be between 0 and 10`);

    if (isNaN(value)) throw new BadRequestException('Invalid input');

    return Number(value);
  }
}

// Pipes run inside the exceptions zone. This means that when a Pipe throws an exception it is handled by the exceptions layer (global exceptions filter and any exceptions filters that are applied to the current context). Given the above, it should be clear that when an exception is thrown in a Pipe, no controller method is subsequently executed. This gives you a best-practice technique for validating data coming into the application from external sources at the system boundary.
