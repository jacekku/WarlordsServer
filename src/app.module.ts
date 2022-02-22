import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';
import { BuildingsModule } from './buildings/buildings.module';
import { ItemsModule } from './items/items.module';
import { LoggingModule } from './logging/logging.module';
import { StateModule } from './state/state.module';
import { TerrainModule } from './terrain/terrain.module';
import { TimerModule } from './timer/timer.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
    }),
    MongooseModule.forRoot(
      `mongodb://${env.MONGO_HOST}${
        env.MONGO_PORT ? `:${env.MONGO_PORT}` : ''
      }/${env.MONGO_DB_NAME}`,
    ),

    TerrainModule,
    UsersModule,
    StateModule,
    ItemsModule,
    LoggingModule,
    BuildingsModule,
    TimerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
