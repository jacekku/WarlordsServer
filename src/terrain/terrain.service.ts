import { ConfigurableLogger } from '@Logging/logging.service';
import {
  Injectable,
  OnModuleInit,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITerrainPersistence } from '@Persistence/terrain/interfaces/terrain-persistence-interface.service';
import { StateService } from '@State/state.service';
import { Chunk } from '@Terrain/model/chunk.model';
import { Quad } from '@Terrain/model/quad.model';
import { Terrain } from '@Terrain/model/terrain.model';
import { Utilities } from '@Terrain/utilities/utilities.service';
import { Player } from '@Users/model/player.model';
import { TERRAIN_PERSISTENCE_SERVICE } from 'src/constants';

@Injectable()
export class TerrainService implements OnModuleInit {
  private logger = new ConfigurableLogger(TerrainService.name);
  public terrain: Terrain;
  constructor(
    @Inject(TERRAIN_PERSISTENCE_SERVICE)
    private readonly terrainPersistentStorage: ITerrainPersistence,
    private readonly stateService: StateService,
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    this.loadDefaultMap();
  }

  loadDefaultMap() {
    const mapId = this.configService.get<string>('DEFAULT_TERRAIN');
    if (mapId && mapId !== 'none') {
      this.reloadMapFromId(mapId);
    } else {
      this.logger.warn('no map loaded; no DEFAULT_TERRAIN specified in .env');
    }
  }

  getMapInfo() {
    if (!this.terrain) {
      throw new BadRequestException('No map loaded!');
    }
    return this.terrain;
  }

  returnChunksVisibleToPlayer(player: Player, chunks: number[] = []): any {
    const playerFrustum = Utilities.calculatePlayerFrustum(
      this.stateService.findConnectedPlayer(player),
      this.terrain,
      this.configService.get<number>('FRUSTUM_SIZE'),
    );
    const visibleChunks = this.terrain.chunks.filter((chunk) =>
      Quad.quadsOverlapping(chunk, playerFrustum),
    );
    return visibleChunks.filter((chunk: Chunk) => !chunks.includes(chunk.id));
  }

  async getChunk(chunkId: number): Promise<Chunk> {
    return await this.terrainPersistentStorage.getChunk(
      this.terrain.mapId,
      chunkId,
    );
  }

  reloadMapFromId(mapId: string) {
    this.terrainPersistentStorage
      .getMap(mapId)
      .then((map) => {
        this.loadMap(map);
        this.logger.log('map loaded: ' + map.mapId);
      })
      .catch((err) => {
        this.logger.error({
          message: `cannot load map from storage ${mapId}`,
          err: err.toString(),
        });
      });

    return true;
  }

  async saveMap(terrain: Terrain): Promise<Terrain> {
    this.terrainPersistentStorage.saveMap(terrain);
    return await this.terrainPersistentStorage.getMap(terrain.mapId);
  }

  generateMap(width: number, height: number, chunkSize: number): Terrain {
    const terrain = Terrain.generateMap(width, height, chunkSize);
    return terrain;
  }

  loadMap(terrain: Terrain) {
    this.terrain = new Terrain(
      terrain.width,
      terrain.height,
      terrain.chunkSize,
      terrain.chunks,
      terrain.mapId,
      terrain.chunkNumber,
    );
    this.stateService.terrain = this.terrain;
    this.stateService.updateTerrain();
    return this.terrain;
  }
}
