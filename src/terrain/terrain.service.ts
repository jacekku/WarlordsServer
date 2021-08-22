import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chunk } from 'src/model/terrain/chunk.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { TerrainFileService } from 'src/persistence/terrain/terrain-persistence.service';

@Injectable()
export class TerrainService {
  private logger = new Logger(TerrainService.name);
  public terrain: Terrain;
  constructor(
    private readonly terrainPersistentStorage: TerrainFileService,
    private readonly configService: ConfigService,
  ) {
    this.loadDefaultMap();
  }

  loadDefaultMap() {
    const mapId = this.configService.get<string>('DEFAULT_TERRAIN');
    this.logger.debug(mapId);
    this.reloadMapFromId(mapId);
  }

  getMapInfo() {
    if (!this.terrain) {
      throw new BadRequestException('No map loaded!');
    }
    return this.terrain;
  }

  // loadFromFile() {
  //     const terrain = fs.readFileSync('maps/map-100x100x10-1609325555649.json')
  //     this.terrainWrapper.loadMap(JSON.parse(terrain))
  //     console.log('loaded map from file')
  //     return true
  // }

  // async reloadRecentMap() {
  //     const map = await this.permanentStorage.getMostRecentMap()
  //     this.terrainWrapper.loadMap(map)
  //     console.log('loaded recent map')
  //     return true
  // }

  getChunk(chunkId: number): Chunk {
    return this.terrainPersistentStorage.getChunk(this.terrain.mapId, chunkId);
  }

  async reloadMapFromId(mapId: string) {
    // if (mapId == "recent") {
    //     return await this.reloadRecentMap()
    // }
    const map = await this.terrainPersistentStorage.getMap(mapId);
    this.loadMap(map);
    this.logger.debug('map loaded: ' + map.mapId);
    return true;
  }

  saveMap(terrain: Terrain): Terrain {
    this.terrainPersistentStorage.saveMap(terrain);
    return this.terrainPersistentStorage.getMap(terrain.mapId);
  }

  generateMap(width, height, chunkSize): Terrain {
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
    return this.terrain;
  }
}