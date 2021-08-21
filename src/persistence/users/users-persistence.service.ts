import { Injectable } from '@nestjs/common';
import { Terrain } from 'src/model/terrain/terrain.model';
import { IUsersPersistence } from './interfaces/users-persistence-interface.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Player } from 'src/model/player.model';
@Injectable()
export class UsersFileService implements IUsersPersistence {
  constructor(private configService: ConfigService) {}
  private PLAYER_FOLDER = `${this.configService.get<string>(
    'SAVE_FOLDER',
  )}/mapId/players`;

  savePlayers(terrain: Terrain) {
    fs.mkdirSync(this.getPlayersPath(terrain.mapId, '_'), {
      recursive: true,
    });
  }

  getPlayer(playerName: string): Player {
    return;
  }

  private getPlayersPath(mapId: string, playerName: string): string {
    return (
      this.PLAYER_FOLDER.replace('mapId', mapId) + '/' + playerName + '.json'
    );
  }
}
