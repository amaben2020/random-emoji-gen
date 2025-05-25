import { BadRequestException } from '@nestjs/common';
import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  const emojiPipe = new EmojiValidationPipe().transform(undefined);
  it('should be defined', () => {
    expect(new EmojiValidationPipe()).toBeDefined();
  });

  it('should be undefined if no value is passed in', () => {
    expect(emojiPipe).toBeUndefined();
  });

  it('should return a random emoji if the value is not an integer', () => {
    expect(() => new EmojiValidationPipe().transform('amala')).toThrow(
      BadRequestException,
    );
  });
});
