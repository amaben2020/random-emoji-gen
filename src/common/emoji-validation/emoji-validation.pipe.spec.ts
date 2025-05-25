import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  const emojiPipe = new EmojiValidationPipe().transform(undefined);
  it('should be defined', () => {
    expect(new EmojiValidationPipe()).toBeDefined();
  });

  it('should be undefined if no value is passed in', () => {
    expect(emojiPipe).toBeUndefined();
  });
});
