import { Character } from '@Users/domain/model/character.model';
import { Player } from 'src/common_model/player.model';

export interface IUsersPersistence {
  getCharacter(characterName: string, mapId: string);
  savePlayer(newPlayer: Player, mapId: string): void;
  getPlayer(playerName: string, mapId: string): Promise<Player>;
  registerPlayer(newPlayer: Player, mapId: string): Promise<Player>;
  registerCharacter(newCharacter: Character): Promise<Character>;
  getCharacters(uid: string): Promise<Character[]>;
}
