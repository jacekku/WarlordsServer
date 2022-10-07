import { Building } from '@Buildings/model/building.model';
import { Injectable } from '@nestjs/common';
import { IBuildingsPersistence } from '@Persistence/buildings/interfaces/buildings-persistence-interface.model';
import { BuildingDocument } from '@Persistence/buildings/mongodb/schema/building.schema';
import { Model } from 'mongoose';

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
