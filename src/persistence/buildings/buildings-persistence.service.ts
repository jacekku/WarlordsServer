import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { Building } from 'src/model/buildings/building.model';

@Injectable()
export class BuildingFileService {
  constructor(private configService: ConfigService) {}

  private BUILDINGS_FOLDER = `${this.configService.get(
    'SAVE_FOLDER',
  )}/mapId/buildings`;

  private getBuildingsPath(mapId: string): string {
    return this.BUILDINGS_FOLDER.replace('mapId', mapId);
  }

  createBuilding(building: Building, mapId: string) {
    if (!fs.existsSync(this.getBuildingsPath(mapId))) {
      fs.mkdirSync(this.getBuildingsPath(mapId), { recursive: true });
    }
    fs.writeFileSync(
      `${this.getBuildingsPath(mapId)}/${building.id}.json`,
      JSON.stringify(building),
    );
    return this.getBuilding(building, mapId);
  }

  updateBuilding(building: Building, mapId: string) {
    if (!fs.existsSync(this.getBuildingsPath(mapId))) {
      fs.mkdirSync(this.getBuildingsPath(mapId), { recursive: true });
    }
    fs.writeFileSync(
      `${this.getBuildingsPath(mapId)}/${building.id}.json`,
      JSON.stringify(building),
    );
  }

  removeBuilding(building: Building, mapId: string) {
    if (!fs.existsSync(this.getBuildingsPath(mapId))) {
      fs.mkdirSync(this.getBuildingsPath(mapId), { recursive: true });
    }
    fs.rmSync(`${this.getBuildingsPath(mapId)}/${building.id}.json`);
  }

  getBuilding(building: Building, mapId: string): Building {
    const buildingData = fs.readFileSync(
      `${this.getBuildingsPath(mapId)}/${building.id}.json`,
    );
    return JSON.parse(buildingData.toString());
  }

  getAllBuildings(mapId: string) {
    if (!fs.existsSync(this.getBuildingsPath(mapId))) {
      fs.mkdirSync(this.getBuildingsPath(mapId), { recursive: true });
    }
    const filenames = fs.readdirSync(this.getBuildingsPath(mapId));
    const buildings = [];
    filenames.forEach((filename) => {
      const data = fs.readFileSync(
        `${this.getBuildingsPath(mapId)}/${filename}`,
      );
      buildings.push(JSON.parse(data.toString()));
    });
    return buildings;
  }
}
