import { StateService } from '@State/state.service';
import { Terrain } from '@Terrain/model/terrain.model';
import { Player } from '@Users/domain/model/player.model';

describe('State Service', () => {
  let stateService: StateService;
  const mockPlayer = new Player('mock', 0, 0);

  beforeAll(() => {
    stateService = new StateService();
    stateService.players = [mockPlayer];
    stateService.terrain = Terrain.generateMap(5, 5, 1);
  });
  it('should find connected player', () => {
    const found = stateService.findConnectedPlayer(mockPlayer);
    expect(found).toStrictEqual(mockPlayer);
  });

  it('should not find player not connected', () => {
    const found = stateService.findConnectedPlayer({ name: 'another' } as any);
    expect(found).toBeUndefined();
  });

  it('should find wood definition', () => {
    const found = stateService.getItemDefinition({ name: 'wood' } as any);
    expect(found.name).toBe('wood');
    expect(found.craftable).toBeUndefined();
    expect(found.equipable).toBeUndefined();
  });

  it('should not find mock definition', () => {
    const found = stateService.getItemDefinition({ name: 'mock' } as any);
    expect(found).toStrictEqual({});
  });

  it('should update player', () => {
    stateService.updatePlayer({ name: 'mock', x: 1, y: 1 } as any);
    const found = stateService.findConnectedPlayer(mockPlayer);
    expect(found.name).toBe('mock');
    expect(found.x).toBe(1);
    expect(found.y).toBe(1);
  });

  it('should return if player not found', () => {
    const result = stateService.updatePlayer({
      name: 'another',
      x: 1,
      y: 1,
    } as any);
    expect(result).toBeUndefined();
  });

  it("should return undefined if item doesn't exist", () => {
    const found = stateService.itemExists({ name: 'mock' } as any);
    expect(found).toBeUndefined();
  });
});
