import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { env } from 'process';
import { Building } from 'src/buildings/model/building.model';
import {
  BUILDINGS_PERSISTENCE_SERVICE,
  TERRAIN_PERSISTENCE_SERVICE,
  USERS_PERSISTENCE_SERVICE,
} from 'src/constants';
import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';
import { Character } from '@Users/domain/model/character.model';
import { Player } from 'src/common_model/player.model';
import { BuildingFileService } from './buildings/file/buildings-persistence.service';
import { BuildingsMongoService } from './buildings/mongodb/buildings-persistence-mongodb.service';
import {
  BuildingDocument,
  BuildingSchema,
} from './buildings/mongodb/schema/building.schema';
import { TerrainFileService } from './terrain/file/terrain-persistence.service';
import {
  ChunkDocument,
  ChunkSchema,
  TerrainDocument,
  TerrainSchema,
} from './terrain/mongodb/schema/terrain.schema';
import { TerrainMongoService } from './terrain/mongodb/terrain-persistence-mongodb.service';
import { UsersFileService } from './users/file/users-persistence.service';
import {
  CharacterDocument,
  CharacterSchema,
  PlayerDocument,
  PlayerSchema,
} from './users/mongodb/schema/user.schema';
import { UsersMongoService } from './users/mongodb/users-persistence-mongodb.service';

const terrainPersistenceServiceProvider: Provider<any> = {
  provide: TERRAIN_PERSISTENCE_SERVICE,
  useFactory: (
    configService: ConfigService,
    chunkModel: Model<ChunkDocument>,
    terrainModel: Model<TerrainDocument>,
  ) => {
    return env.PERSISTENCE_TYPE === 'mongodb'
      ? new TerrainMongoService(chunkModel, terrainModel)
      : new TerrainFileService(configService);
  },
  inject: [
    ConfigService,
    getModelToken(Chunk.name),
    getModelToken(Terrain.name),
  ],
};

const usersPersistenceServiceProvider: Provider<any> = {
  provide: USERS_PERSISTENCE_SERVICE,
  useFactory: (
    configService: ConfigService,
    playerModel: Model<PlayerDocument>,
    characterModel: Model<CharacterDocument>,
  ) => {
    return env.PERSISTENCE_TYPE === 'mongodb'
      ? new UsersMongoService(playerModel, characterModel)
      : new UsersFileService(configService);
  },
  inject: [
    ConfigService,
    getModelToken(Player.name),
    getModelToken(Character.name),
  ],
};

const buildingsPersistenceServiceProvider: Provider<any> = {
  provide: BUILDINGS_PERSISTENCE_SERVICE,
  useFactory: (
    configService: ConfigService,
    buildingModel: Model<BuildingDocument>,
  ) => {
    return env.PERSISTENCE_TYPE === 'mongodb'
      ? new BuildingsMongoService(buildingModel)
      : new BuildingFileService(configService);
  },
  inject: [ConfigService, getModelToken(Building.name)],
};

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Building.name, schema: BuildingSchema },
      { name: Chunk.name, schema: ChunkSchema },
      { name: Terrain.name, schema: TerrainSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  providers: [
    terrainPersistenceServiceProvider,
    usersPersistenceServiceProvider,
    buildingsPersistenceServiceProvider,
  ],
  exports: [
    terrainPersistenceServiceProvider,
    usersPersistenceServiceProvider,
    buildingsPersistenceServiceProvider,
  ],
})
export class PersistenceModule {}
