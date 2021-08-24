import { Player } from 'src/model/users/player.model';
import { Quad } from 'src/model/terrain/quad.model';
import { Terrain } from 'src/model/terrain/terrain.model';

export class Utilities {
  static getXY(index: number, columns: number): { x: number; y: number } {
    return {
      x: index % columns,
      y: Math.floor(index / columns),
    };
  }

  static clampNumber(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  static map(
    n: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number,
  ): number {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }

  static calculatePlayerFrustum(
    player: Player,
    terrain: Terrain,
    frustumSize: number,
  ): Quad {
    const x = Utilities.clampNumber(
      player.x - Math.floor(frustumSize / 2),
      0,
      terrain.width - frustumSize,
    );
    const y = Utilities.clampNumber(
      player.y - Math.floor(frustumSize / 2),
      0,
      terrain.height - frustumSize,
    );
    return new Quad(x, y, frustumSize, frustumSize);
  }
}
