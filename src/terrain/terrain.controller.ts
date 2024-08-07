import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { Roles } from '@Auth/roles.decorator';
import { UseGuards, Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Terrain } from '@Terrain/model/terrain.model';
import { TerrainService } from '@Terrain/terrain.service';

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
    return this.terrainService.reloadMapFromId(mapId);
  }

  @Get('chunk/:chunkId')
  @Roles('admin')
  async getChunk(@Param('chunkId') chunkId: number) {
    return await this.terrainService.getChunk(chunkId);
  }
}
