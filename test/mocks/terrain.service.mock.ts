export const mockTerrain = { width: 10, height: 10, mapId: 'mockMapId' };

export const terrainServiceMock = {
  getMap: () => Promise.resolve(mockTerrain),
};
