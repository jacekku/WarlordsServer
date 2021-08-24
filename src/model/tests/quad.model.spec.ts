import { Quad } from '../terrain/quad.model';
import * as chunks from './chunks.json';

describe('Quad Model', () => {
  const frustum = { x: 6, y: 0, width: 13, height: 13 } as Quad;

  describe('quadsOverlapping', () => {
    it('should return 9', () => {
      const filteredChunks = chunks.filter((chunk) =>
        Quad.quadsOverlapping(chunk as any, frustum),
      );
      expect(filteredChunks).toHaveLength(9);
    });
  });
});
