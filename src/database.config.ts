import { registerAs } from '@nestjs/config';

const databaseConfig = registerAs('database', () => ({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT!),
  synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  autoloadEntities: process.env.DB_AUTOLOAD_ENTITIES === 'true' ? true : false,
}));

export default databaseConfig;
