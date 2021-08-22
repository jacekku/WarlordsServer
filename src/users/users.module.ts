import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { TerrainModule } from 'src/terrain/terrain.module';
import { UsersController } from './users.controller';
import { UsersWebsocketGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  //TODO: remove TerrainModule hack (needed mapId in saveUser)
  imports: [PersistenceModule, TerrainModule],
  controllers: [UsersController],
  providers: [UsersService, UsersWebsocketGateway],
})
export class UsersModule {}
