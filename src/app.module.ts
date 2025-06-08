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
import { Post } from './posts/post.entity';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/tag.entity';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { MetaOption } from './meta-options/meta-options.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { WalletController } from './wallet/wallet.controller';
import databaseConfig from './database.config';
import appConfig from './app.config';
import jwtConfig from './auth/config/jwtConfig';
import enviromentValidation from 'environment.config';
import { Wallet } from './wallet/wallet.entity';
import { paystackConfig } from './wallet/config/paystackConfig';
import { VtpassModule } from './vtpass/vtpass.module';

const ENV = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    CatsModule,
    UsersModule,
    PostsModule,
    TagsModule,
    AuthModule,
    WalletModule,
    MetaOptionsModule,
    VtpassModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [appConfig, databaseConfig, jwtConfig, paystackConfig],
      validationSchema: enviromentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host')!,
        port: configService.get('database.port')!,
        username: configService.get('database.username')!,
        password: configService.get('database.password')!,
        database: configService.get('database.name')!,
        synchronize: configService.get('database.synchronize')!, // do not use in production!
        autoLoadEntities: configService.get('database.autoLoadEntities')!,
        // add every entity here
        entities: [User, Post, Tag, MetaOption, Wallet],
      }),
    }),

    MetaOptionsModule,

    AuthModule,

    WalletModule,

    VtpassModule,
  ],
  controllers: [AppController, WalletController],
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
