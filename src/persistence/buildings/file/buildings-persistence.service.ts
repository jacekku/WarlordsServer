import { Building } from '@Buildings/model/building.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBuildingsPersistence } from '@Persistence/buildings/interfaces/buildings-persistence-interface.model';
import * as fs from 'fs';
@Injectable()
export class BuildingFileService implements IBuildingsPersistence {
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

  async getBuilding(building: Building, mapId: string): Promise<Building> {
    const buildingData = fs.readFileSync(
      `${this.getBuildingsPath(mapId)}/${building.id}.json`,
    );
    return Building.from(JSON.parse(buildingData.toString()));
  }

  async getAllBuildings(mapId: string): Promise<Building[]> {
    if (!fs.existsSync(this.getBuildingsPath(mapId))) {
      fs.mkdirSync(this.getBuildingsPath(mapId), { recursive: true });
    }
    const filenames = fs.readdirSync(this.getBuildingsPath(mapId));
    const buildings = [];
    filenames.forEach((filename) => {
      const data = fs.readFileSync(
        `${this.getBuildingsPath(mapId)}/${filename}`,
      );
      buildings.push(Building.from(JSON.parse(data.toString())));
    });
    return buildings;
  }
}
