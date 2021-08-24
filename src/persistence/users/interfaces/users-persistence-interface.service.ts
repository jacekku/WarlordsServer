import { Player } from 'src/model/users/player.model';
import { Terrain } from 'src/model/terrain/terrain.model';

export interface IUsersPersistence {
  savePlayer(newPlayer: Player, mapId: string): void;
  getPlayer(playerName: string, mapId: string): Player;
}
