import { Block } from 'src/terrain/model/block.model';
import { ANIMALS } from 'src/terrain/model/enums/animals.model';
import { BIOMES } from 'src/terrain/model/enums/biomes.model';
import { MATERIALS } from 'src/terrain/model/enums/materials.model';
import { MOISTURE } from 'src/terrain/model/enums/moisture.model';

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
      field: ItemsActionMapper.FIELDS.moisture,
      values: [{ value: MOISTURE.DESERT, item: 'sand' }],
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
    GATHER_STONES: {
      field: ItemsActionMapper.FIELDS.biome,
      values: [{ value: BIOMES.MOUNTAIN, item: 'stone' }],
    },
    MINE_STONES: {
      field: ItemsActionMapper.FIELDS.biome,
      values: [{ value: BIOMES.MOUNTAIN, item: 'stone' }],
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
