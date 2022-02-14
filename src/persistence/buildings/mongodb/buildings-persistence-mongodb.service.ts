import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Building } from 'src/buildings/model/building.model';
import { IBuildingsPersistence } from '../interfaces/buildings-persistence-interface.model';
import { BuildingDocument } from './schema/building.schema';

@Injectable()
export class BuildingsMongoService implements IBuildingsPersistence {
  constructor(private buildingModel: Model<BuildingDocument>) {}

  async updateBuilding(building: Building, mapId: string) {
    building.mapId = mapId;
    new this.buildingModel(building).save();
  }
  async removeBuilding(building: Building, mapId: string) {
    this.buildingModel
      .findOneAndRemove({ id: building.id, mapId: mapId })
      .exec();
  }
  async getBuilding(building: Building, mapId: string): Promise<Building> {
    return this.buildingModel.findOne({ id: building.id, mapId: mapId }).exec();
  }
  async getAllBuildings(mapId: string): Promise<Building[]> {
    return this.buildingModel.find({ mapId: mapId }).exec();
  }
  async createBuilding(building: Building, mapId: string): Promise<Building> {
    building.mapId = mapId;
    const created = new this.buildingModel(building);
    return created.save();
  }
}
