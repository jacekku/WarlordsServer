import { Injectable } from '@nestjs/common';
import { IUsersPersistence } from '../../../domain/ports/repositories/usersRepo.port';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Player } from 'src/common_model/player.model';
import { Character } from 'src/common_model/character.model';

@Injectable()
export class UsersFileService implements IUsersPersistence {
  constructor(private configService: ConfigService) {}

  private PLAYER_FOLDER = `${this.configService.get<string>(
    'SAVE_FOLDER',
  )}/mapId/players`;

  createFolder(player: Player, mapId: string) {
    fs.mkdirSync(this.getPlayersPath(mapId, player.name), {
      recursive: true,
    });
  }

  savePlayer(newPlayer: Player, mapId: string) {
    if (!this.folderExists(mapId, newPlayer.name)) {
      this.createFolder(newPlayer, mapId);
    }
    fs.writeFileSync(
      this.getPlayerFilePath(mapId, newPlayer.name),
      JSON.stringify(newPlayer),
    );
    return this.getPlayer(newPlayer.name, mapId);
  }

  async registerCharacter(newCharacter: Character): Promise<Character> {
    throw new Error('Method not implemented.');
  }
  getCharacters(uid: string): Promise<Character[]> {
    throw new Error('Method not implemented.');
  }
  getCharacter(characterName: string, mapId: string): Promise<Character> {
    throw new Error('Method not implemented.');
  }

  async getPlayer(playerName: string, mapId: string): Promise<Player> {
    if (!this.folderExists(mapId, playerName)) return;
    const data = fs.readFileSync(this.getPlayerFilePath(mapId, playerName));
    return JSON.parse(data.toString());
  }

  private getPlayersPath(mapId: string, playerName: string): string {
    return this.PLAYER_FOLDER.replace('mapId', mapId) + '/' + playerName;
  }

  private getPlayerFilePath(mapId: string, playerName: string) {
    return this.getPlayersPath(mapId, playerName) + '/player.json';
  }

  private folderExists(mapId: string, playerName: string) {
    return fs.existsSync(this.getPlayerFilePath(mapId, playerName));
  }
}
