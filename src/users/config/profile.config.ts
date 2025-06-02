import { registerAs } from '@nestjs/config';

const profileConfig = registerAs('profileConfig', () => ({
  apiKey: 'process.env.PROFILE_NAME',
}));

export default profileConfig;
