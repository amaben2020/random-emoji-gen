import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { LoggerService } from './logger.service';
import { AuthGuard } from './common/auth/auth.guard';
import { TransformResponseInterceptor } from './common/transform-response/transform-response.interceptor';
// import { AllExceptionsFilter } from './common/all-exceptions/all-exceptions.filter';
import { CatsModule } from './core/database/cats.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    CatsModule,
    UsersModule,
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'nestjs-blog',
      entities: [User],
      synchronize: true, // do not use in production!
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformResponseInterceptor,
    },
    // {
    //   provide: 'APP_FILTER',
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}

//
