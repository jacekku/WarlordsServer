import { Body, SetMetadata, UseGuards } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Terrain } from './model/terrain.model';
import { TerrainService } from './terrain.service';

@UseGuards(JwtAuthGuard)
@Controller('terrain')
export class TerrainController {
  constructor(private readonly terrainService: TerrainService) {}

  @Get()
  getMapInfo() {
    return this.terrainService.getMapInfo();
  }

  @Post('generate/:width-:height-:chunkSize')
  @Roles('admin')
  generateMap(
    @Param('width') width,
    @Param('height') height,
    @Param('chunkSize') chunkSize,
  ) {
    return this.terrainService.generateMap(width, height, chunkSize);
  }

  @Post('save')
  @Roles('admin')
  saveMap(@Body() terrain: Terrain) {
    this.terrainService.saveMap(terrain);
  }
  @Post('generateAndSave/:width-:height-:chunkSize')
  @Roles('admin')
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
  @Roles('admin')
  reloadMapFromId(@Param('mapId') mapId: string) {
    this.terrainService.reloadMapFromId(mapId);
  }

  @Get('chunk/:chunkId')
  @Roles('admin')
  async getChunk(@Param('chunkId') chunkId: number) {
    return await this.terrainService.getChunk(chunkId);
  }
}
