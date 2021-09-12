import { MATERIALS } from 'src/model/terrain/enums/materials.model';
import { MOISTURE } from 'src/model/terrain/enums/moisture.model';
import { ItemsActionMapper } from '../items-action.mapper';

describe('Items Action Mapper', () => {
  it('should return wood for chop wood', () => {
    const mockBlock = {
      moisture: MOISTURE.FOREST,
    } as any;
    const item = ItemsActionMapper.mapActionToItem('CHOP WOOD', mockBlock);
    expect(item).toBe('wood');
  });

  it('should return ores from mine action', () => {
    let mockBlock = {
      materials: MATERIALS.COPPER,
    } as any;
    expect(testOres(mockBlock)).toBe('copper_ore');
    mockBlock = {
      materials: MATERIALS.IRON,
    } as any;
    expect(testOres(mockBlock)).toBe('iron_ore');
    mockBlock = {
      materials: MATERIALS.GOLD,
    } as any;
    expect(testOres(mockBlock)).toBe('gold_ore');
    mockBlock = {
      materials: MATERIALS.TIN,
    } as any;
    expect(testOres(mockBlock)).toBe('tin_ore');
    mockBlock = {
      materials: MATERIALS.SALT,
    } as any;
    expect(testOres(mockBlock)).toBe('salt');
    mockBlock = {
      materials: MATERIALS.COAL,
    } as any;
    expect(testOres(mockBlock)).toBe('coal');
  });

  function testOres(block: any) {
    return ItemsActionMapper.mapActionToItem('MINE', block);
  }

  it('should fail if moisture not right', () => {
    const mockBlock = {
      materials: MOISTURE.DESERT,
    } as any;
    const item = ItemsActionMapper.mapActionToItem('CHOP WOOD', mockBlock);
    expect(item).toBeUndefined();
  });
});
