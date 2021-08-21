import { Player } from 'src/model/player.model';
import { Terrain } from 'src/model/terrain/terrain.model';

export interface IUsersPersistence {
  savePlayers(terrain: Terrain): void;
  getPlayer(playerName: string): Player;
}
