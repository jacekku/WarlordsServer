import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';

export class UserPersistenceMock implements IUsersPersistence {
  private DB: Player[] = [];
  private CHARS: Character[] = [];

  savePlayer(newPlayer: Player, mapId: string): Promise<Player> {
    this.DB.push(newPlayer);
    return this.getPlayer(newPlayer.name, mapId);
  }
  getPlayer(playerName: string, mapId: string): Promise<Player> {
    return Promise.resolve(this.DB.find((player) => player.name == playerName));
  }
  registerCharacter(newCharacter: Character): Promise<Character> {
    this.CHARS.push(newCharacter);
    return this.getCharacter(newCharacter.characterName, newCharacter.mapId);
  }
  getCharacter(characterName: string, mapId: string): Promise<Character> {
    return Promise.resolve(
      this.CHARS.find((char) => char.characterName == characterName),
    );
  }
  getCharacters(uid: string): Promise<Character[]> {
    throw new Error('Method not implemented.');
  }

  TEST_CLEAR_DB() {
    this.DB = [];
    this.CHARS = [];
  }
}
