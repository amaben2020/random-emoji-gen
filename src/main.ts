import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BrowserInterceptor } from './common/browser/browser.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new BrowserInterceptor());

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
