import {
  BadRequestException,
  Injectable,
  BeforeApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Quad } from 'src/model/terrain/quad.model';
import { UsersFileService } from 'src/persistence/users/users-persistence.service';
import { StateService } from 'src/state/state.service';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Player } from '../model/users/player.model';

@Injectable()
export class UsersService implements BeforeApplicationShutdown {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersPersistenceService: UsersFileService,
    private readonly stateService: StateService,
    private readonly configService: ConfigService,
  ) {
    stateService.players = [];
  }

  getPlayer(playerName: string): Player {
    return this.usersPersistenceService.getPlayer(
      playerName,
      this.stateService.terrain.mapId,
    );
  }

  registerPlayer(newPlayer: Player): Player {
    const newlySpawnedPlayer = new Player(newPlayer.name, 10, 10);
    return this.usersPersistenceService.registerPlayer(
      newlySpawnedPlayer,
      this.stateService.terrain.mapId,
    );
  }

  movePlayer(player: Player, move: { x: number; y: number }) {
    //validatePlayerMovement()
    player = this.findConnectedPlayer(player);
    player.x = move.x;
    player.y = move.y;
    return player;
  }

  checkIfPlayerAlreadyConnected(newPlayer: Player) {
    if (this.findConnectedPlayer(newPlayer)) {
      throw new BadRequestException(
        'player already connected: ' + newPlayer.name,
      );
    }
  }

  playerConnected(newPlayer: Player): Player {
    const player =
      this.getPlayer(newPlayer.name) || this.registerPlayer(newPlayer);
    this.stateService.players.push(player);
    return player;
  }

  playerDisconnected(playerName: string) {
    const disconnectedPlayer = this.findConnectedPlayerByName(playerName);
    if (!disconnectedPlayer) {
      this.logger.error(
        "tried to disconnect a player but couldn't find them: " + playerName,
      );
    }
    this.stateService.players = this.stateService.players.filter(
      (player) => player.name != disconnectedPlayer.name,
    );
    this.usersPersistenceService.savePlayer(
      disconnectedPlayer,
      this.stateService.terrain.mapId,
    );
  }

  getAllConnectedPlayers() {
    return this.stateService.players;
  }

  findVisiblePlayers(player: Player) {
    return this.getPlayersInQuad(
      Utilities.calculatePlayerFrustum(
        player,
        this.stateService.terrain,
        this.configService.get<number>('FRUSTUM_SIZE'),
      ),
    );
  }

  getPlayersInQuad(quad: Quad) {
    return this.stateService.players.filter((player) =>
      Quad.pointInQuad(quad, player.x, player.y),
    );
  }

  findConnectedPlayer(playerToFind: Player) {
    return this.stateService.findConnectedPlayer(playerToFind);
  }

  findConnectedPlayerByName(playerName: string) {
    return this.findConnectedPlayer({ name: playerName } as Player);
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.warn('received: ' + signal + ' - saving all players');
    this.logger.warn(
      'players currently connected: ' +
        JSON.stringify(this.stateService.players.map((player) => player.name)),
    );
    this.stateService.players.forEach((player) =>
      this.usersPersistenceService.savePlayer(
        player,
        this.stateService.terrain.mapId,
      ),
    );
  }
}
