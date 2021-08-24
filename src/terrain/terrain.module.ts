import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { TerrainController } from './terrain.controller';
import { TerrainWebsocketGateway } from './terrain.gateway';
import { TerrainService } from './terrain.service';

@Module({
  imports: [PersistenceModule, StateModule],
  controllers: [TerrainController],
  providers: [TerrainService, TerrainWebsocketGateway],
})
export class TerrainModule {}
