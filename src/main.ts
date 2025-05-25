import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BrowserInterceptor } from './common/browser/browser.interceptor';
import { AuthGuard } from './common/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalInterceptors(new BrowserInterceptor());
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
