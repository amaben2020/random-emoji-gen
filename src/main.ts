import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BrowserInterceptor } from './common/browser/browser.interceptor';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new BrowserInterceptor());

  // you must use class validator and transform
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away non-whitelisted properties
      forbidNonWhitelisted: true, // Throws error if non-whitelisted values are provided
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();

// nest g mo users
