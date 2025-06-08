import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BrowserInterceptor } from './common/browser/browser.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Nest js masterclass')
    .setDescription('Base URL http://localhost:9000')
    .setTermsOfService('http://localhost:9000/terms-of-service')
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:9000', 'Localhost')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document);
  app.enableCors(); // Add this before `app.listen()`
  await app.listen(process.env.PORT ?? 9000, '0.0.0.0');
}
bootstrap();

// nest g mo users
