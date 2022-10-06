import { Module } from '@nestjs/common';
import { PersistenceModule } from '@Persistence/persistence.module';
import { StateModule } from '@State/state.module';
import { TerrainController } from '@Terrain/terrain.controller';
import { TerrainWebsocketGateway } from '@Terrain/terrain.gateway';
import { TerrainService } from '@Terrain/terrain.service';

@Module({
  imports: [PersistenceModule, StateModule],
  controllers: [TerrainController],
  providers: [TerrainService, TerrainWebsocketGateway],
})
export class TerrainModule {}
