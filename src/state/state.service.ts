import { Injectable } from '@nestjs/common';
import { Player } from 'src/model/users/player.model';
import { Terrain } from 'src/model/terrain/terrain.model';

@Injectable()
export class StateService {
  public terrain: Terrain;
  public players: Player[];

  getState() {
    return { terrain: this.terrain, players: this.players };
  }

  findConnectedPlayer(playerToFind: Player) {
    return this.players.find((player) => player.name === playerToFind.name);
  }

  updatePlayer(player: Player) {
    const playerIndex = this.players.findIndex((p) => player.name === p.name);
    if (playerIndex < 0) {
      return;
    }
    const currentPlayer = this.players[playerIndex];
    this.players[playerIndex] = Object.assign(currentPlayer, player);
  }
}
