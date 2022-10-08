import { JwtStrategy } from '@Auth/jwt.strategy';
import { RolesGuard } from '@Auth/roles.guard';
import { BuildingsModule } from '@Buildings/buildings.module';
import { ItemsModule } from '@Items/items.module';
import { LoggingModule } from '@Logging/logging.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { StateModule } from '@State/state.module';
import { TerrainModule } from '@Terrain/terrain.module';
import { TimerModule } from '@Timer/timer.module';
import { UsersModule } from '@Users/users.module';
import { env } from 'process';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
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
