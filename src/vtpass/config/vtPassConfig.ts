import { registerAs } from '@nestjs/config';

export const vtPassConfig = registerAs('vtPass', () => ({
  apiKey: process.env.VT_PASS_API_KEY,
  secretKey: process.env.VT_PASS_SECRET_KEY,
}));
