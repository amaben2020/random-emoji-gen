import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log('LIFECYCLE 4: PIPE');
    console.log(value);
    if (!value) return;

    if (value < 0 || value > 10)
      throw new BadRequestException(`Index must be between 0 and 10`);

    if (isNaN(value)) throw new BadRequestException('Invalid input');

    return Number(value);
  }
}
