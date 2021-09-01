import { EquipmentType } from './equipment-type.model';

export class Item {
  public id: number;
  public equipmentType: EquipmentType;
  public stackSize: number;
  public uid: number;
  public maxStackSize: number;

  public validateStackSize(newStackSize: number) {
    return newStackSize <= this.maxStackSize;
  }
}
