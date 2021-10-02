import { Equiped } from './equiped.model';
import { EquipmentType } from './equipment-type.model';

export class EquipmentMap {
  public static itemToEquipment(itemType: EquipmentType, equiped: Equiped) {
    const map = new Map([
      [EquipmentType.CHEST, equiped.chest],
      [EquipmentType.LEGS, equiped.legs],
      [EquipmentType.PAULDRONS, equiped.pauldrons],
      [EquipmentType.HEAD, equiped.head],
      [EquipmentType.GAUNTLETS, equiped.gauntlets],
      [EquipmentType.CAPE, equiped.cape],
      [EquipmentType.SHIRT, equiped.shirt],
      [EquipmentType.BOOTS, equiped.boots],
      [EquipmentType.MAINHAND, equiped.mainhand],
      [EquipmentType.OFFHAND, equiped.offhand],
      [EquipmentType.TRINKET, equiped.trinket],
      [EquipmentType.RING, equiped.ring],
    ]);
    return map.get(itemType);
  }
}
