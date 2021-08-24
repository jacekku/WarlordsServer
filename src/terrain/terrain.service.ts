import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Player } from 'src/model/users/player.model';
import { Chunk } from 'src/model/terrain/chunk.model';
import { Quad } from 'src/model/terrain/quad.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { TerrainFileService } from 'src/persistence/terrain/terrain-persistence.service';
import { StateService } from 'src/state/state.service';
import { Utilities } from './utilities/utilities.service';

@Injectable()
export class TerrainService {
  private logger = new Logger(TerrainService.name);
  public terrain: Terrain;
  constructor(
    private readonly terrainPersistentStorage: TerrainFileService,
    private readonly stateService: StateService,
    private readonly configService: ConfigService,
  ) {
    this.loadDefaultMap();
  }

  loadDefaultMap() {
    const mapId = this.configService.get<string>('DEFAULT_TERRAIN');
    this.reloadMapFromId(mapId);
  }

  getMapInfo() {
    if (!this.terrain) {
      throw new BadRequestException('No map loaded!');
    }
    return this.terrain;
  }

  returnChunksVisibleToPlayer(player: Player): any {
    const playerFrustum = Utilities.calculatePlayerFrustum(
      this.stateService.findConnectedPlayer(player),
      this.terrain,
      this.configService.get<number>('FRUSTUM_SIZE'),
    );
    const visibleChunks = this.terrain.chunks.filter((chunk) =>
      Quad.quadsOverlapping(chunk, playerFrustum),
    );
    return visibleChunks;
  }

  getChunk(chunkId: number): Chunk {
    return this.terrainPersistentStorage.getChunk(this.terrain.mapId, chunkId);
  }

  async reloadMapFromId(mapId: string) {
    const map = await this.terrainPersistentStorage.getMap(mapId);
    this.loadMap(map);
    this.logger.log('map loaded: ' + map.mapId);
    return true;
  }

  saveMap(terrain: Terrain): Terrain {
    this.terrainPersistentStorage.saveMap(terrain);
    return this.terrainPersistentStorage.getMap(terrain.mapId);
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
    return this.terrain;
  }
}
