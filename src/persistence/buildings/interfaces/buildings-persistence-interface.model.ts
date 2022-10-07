import { Building } from '@Buildings/model/building.model';

export interface IBuildingsPersistence {
  removeBuilding(building: Building, mapId: string): void;
  getBuilding(building: Building, mapId: string): Promise<Building>;
  getAllBuildings(mapId: string): Promise<Building[]>;
  createBuilding(building: Building, mapId: string): Promise<Building>;
  updateBuilding(building: Building, mapId: string);
}
