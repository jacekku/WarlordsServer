import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  providers: [AppService],
})
export class AppModule {}
