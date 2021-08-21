import { Module } from '@nestjs/common';
import { TerrainFileService } from './terrain/terrain-persistence.service';
import { UsersFileService } from './users/users-persistence.service';

@Module({
  imports: [],
  providers: [TerrainFileService, UsersFileService],
  exports: [TerrainFileService, UsersFileService],
})
export class PersistenceModule {}
