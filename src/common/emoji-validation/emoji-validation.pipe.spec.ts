import { BadRequestException } from '@nestjs/common';
import { EmojiValidationPipe } from './emoji-validation.pipe';
import { LoggerService } from 'src/logger.service';

const emojiValidationPipe = (value: string | number | null | undefined) =>
  new EmojiValidationPipe(new LoggerService()).transform(value);

describe('EmojiValidationPipe', () => {
  it('should be defined', () => {
    expect(new EmojiValidationPipe(new LoggerService())).toBeDefined();
  });

  it('should be undefined if no value is passed in', () => {
    expect(emojiValidationPipe(undefined)).toBeUndefined();
  });

  it('should return a random emoji if the value is not an integer', () => {
    expect(() => emojiValidationPipe('amala')).toThrow(BadRequestException);
  });
  it('should throw error if the value is less than zero', () => {
    expect(() => emojiValidationPipe(-5)).toThrow(BadRequestException);
  });

  it('should return number for integer string', () => {
    expect(emojiValidationPipe('5')).toBe(5);
  });
});
