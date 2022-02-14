import { Body } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { Terrain } from './model/terrain.model';
import { TerrainService } from './terrain.service';

@Controller('terrain')
export class TerrainController {
  constructor(private readonly terrainService: TerrainService) {}

  @Get()
  getMapInfo() {
    return this.terrainService.getMapInfo();
  }

  @Post('generate/:width-:height-:chunkSize')
  generateMap(
    @Param('width') width,
    @Param('height') height,
    @Param('chunkSize') chunkSize,
  ) {
    return this.terrainService.generateMap(width, height, chunkSize);
  }

  @Post('save')
  saveMap(@Body() terrain: Terrain) {
    this.terrainService.saveMap(terrain);
  }
  @Post('generateAndSave/:width-:height-:chunkSize')
  generateAndSave(
    @Param('width') width,
    @Param('height') height,
    @Param('chunkSize') chunkSize,
  ) {
    return this.terrainService.saveMap(
      this.terrainService.generateMap(width, height, chunkSize),
    );
  }

  @Post('reload/:mapId')
  reloadMapFromId(@Param('mapId') mapId: string) {
    this.terrainService.reloadMapFromId(mapId);
  }

  @Get('chunk/:chunkId')
  async getChunk(@Param('chunkId') chunkId: number) {
    return await this.terrainService.getChunk(chunkId);
  }
}
