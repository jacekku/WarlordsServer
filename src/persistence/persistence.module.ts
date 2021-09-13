import { Module } from '@nestjs/common';
import { BuildingFileService } from './buildings/buildings-persistence.service';
import { TerrainFileService } from './terrain/terrain-persistence.service';
import { UsersFileService } from './users/users-persistence.service';

@Module({
  providers: [TerrainFileService, UsersFileService, BuildingFileService],
  exports: [TerrainFileService, UsersFileService, BuildingFileService],
})
export class PersistenceModule {}
