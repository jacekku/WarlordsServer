import { BadRequestException, Injectable } from '@nestjs/common';
import { Quad } from 'src/model/terrain/quad.model';
import { UsersFileService } from 'src/persistence/users/users-persistence.service';
import { TerrainService } from 'src/terrain/terrain.service';
import { Player } from '../model/player.model';

@Injectable()
export class UsersService {
  private _activePlayers: Player[] = [];
  constructor(
    private usersPersistenceService: UsersFileService,
    private terrainService: TerrainService,
  ) {}

  getPlayer(playerName: string): Player {
    return this.usersPersistenceService.getPlayer(
      playerName,
      this.terrainService.terrain.mapId,
    );
  }

  registerPlayer(newPlayer: Player): Player {
    const newlySpawnedPlayer = new Player(newPlayer.name, 10, 10);
    return this.usersPersistenceService.registerPlayer(
      newlySpawnedPlayer,
      this.terrainService.terrain.mapId,
    );
  }

  movePlayer(player: Player, move: { x: number; y: number }) {
    //validatePlayerMovement()
    player = this.findConnectedPlayer(player);
    player.x = move.x;
    player.y = move.y;
    return true;
  }

  playerConnected(newPlayer: Player) {
    if (
      this._activePlayers.findIndex(
        (player) => newPlayer.name === player.name,
      ) !== -1
    ) {
      throw new BadRequestException('player already connected');
    }
    const player =
      this.getPlayer(newPlayer.name) || this.registerPlayer(newPlayer);
    this._activePlayers.push(player);
    return true;
  }

  playerDisconnected(playerName: string) {
    const disconnectedPlayer = this.findConnectedPlayerByName(playerName);
    this._activePlayers = this._activePlayers.filter(
      (player) => player.name != disconnectedPlayer.name,
    );
    this.usersPersistenceService.savePlayer(
      disconnectedPlayer,
      this.terrainService.terrain.mapId,
    );
  }

  getAllConnectedPlayers() {
    return this._activePlayers;
  }

  getPlayersInQuad(quad: Quad) {
    return this._activePlayers.filter((player) =>
      Quad.pointInQuad(quad, player.x, player.y),
    );
  }

  findConnectedPlayer(playerToFind: Player) {
    return this._activePlayers.find(
      (player) => player.name === playerToFind.name,
    );
  }

  findConnectedPlayerByName(playerName: string) {
    return this.findConnectedPlayer({ name: playerName } as Player);
  }
}
