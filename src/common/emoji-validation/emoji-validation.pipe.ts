import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoggerService } from 'src/logger.service';

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
