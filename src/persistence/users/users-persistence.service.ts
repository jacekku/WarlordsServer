import { Injectable } from '@nestjs/common';
import { IUsersPersistence } from './interfaces/users-persistence-interface.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Player } from 'src/users/model/player.model';

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
  }

  registerPlayer(newPlayer: Player, mapId: string): Player {
    this.createFolder(newPlayer, mapId);
    this.savePlayer(newPlayer, mapId);
    return this.getPlayer(newPlayer.name, mapId);
  }

  getPlayer(playerName: string, mapId: string): Player {
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
