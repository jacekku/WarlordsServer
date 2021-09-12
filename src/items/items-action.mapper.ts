import { Block } from 'src/model/terrain/block.model';
import { ANIMALS } from 'src/model/terrain/enums/animals.model';
import { BIOMES } from 'src/model/terrain/enums/biomes.model';
import { MATERIALS } from 'src/model/terrain/enums/materials.model';
import { MOISTURE } from 'src/model/terrain/enums/moisture.model';

export class ItemsActionMapper {
  private static readonly FIELDS = {
    animals: 'animals',
    materials: 'materials',
    moisture: 'moisture',
    biome: 'biome',
  };
  private static readonly MAP = {
    MINE: {
      field: ItemsActionMapper.FIELDS.materials,
      values: [
        { value: MATERIALS.COAL, item: 'coal' },
        { value: MATERIALS.IRON, item: 'iron_ore' },
        { value: MATERIALS.SALT, item: 'salt' },
        { value: MATERIALS.COPPER, item: 'copper_ore' },
        { value: MATERIALS.GOLD, item: 'gold_ore' },
        { value: MATERIALS.TIN, item: 'tin_ore' },
      ],
    },
    EXTRACT: {
      field: ItemsActionMapper.FIELDS.materials,
      values: [{ value: MATERIALS.OIL, item: 'oil' }],
    },
    HUNT: {
      field: ItemsActionMapper.FIELDS.animals,
      values: [{ value: ANIMALS.DEER, item: 'meat' }],
    },
    FISH: {
      field: ItemsActionMapper.FIELDS.animals,
      values: [{ value: ANIMALS.FISH, item: 'meat' }],
    },
    GATHER_SAND: {
      field: ItemsActionMapper.FIELDS.biome,
      values: [
        { value: BIOMES.BEACH, item: 'sand' },
        { value: MOISTURE.DESERT, item: 'sand' },
      ],
    },
    CHOP_WOOD: {
      field: ItemsActionMapper.FIELDS.moisture,
      values: [{ value: MOISTURE.FOREST, item: 'wood' }],
    },
    GATHER_STICKS: {
      field: ItemsActionMapper.FIELDS.moisture,
      values: [{ value: MOISTURE.FOREST, item: 'stick' }],
    },
    FORAGE_BERRIES: {
      field: ItemsActionMapper.FIELDS.moisture,
      values: [{ value: MOISTURE.FOREST, item: 'berries' }],
    },
  };

  static mapActionToItem(action: string, block: Block) {
    action = action.split(' ').join('_');
    const mapped = ItemsActionMapper.MAP[action];
    const value = mapped.values.find(
      (value) => value.value === block[mapped.field],
    );
    if (value) return value.item;
  }
}
