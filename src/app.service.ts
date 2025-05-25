import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEmoji(index?: number): string {
    const emojis = this.getEmojis();
    return index
      ? emojis[index]
      : emojis[Math.floor(Math.random() * emojis.length)];
  }

  getEmojis(): string[] {
    return ['😀', '😂', '🤣', '😊', '😍', '😘', '🤔', '🙄', '😴', '👀'];
  }
}
