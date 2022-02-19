import { Injectable, BeforeApplicationShutdown, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import * as _ from 'lodash';
import { USERS_PERSISTENCE_SERVICE } from 'src/constants';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { IUsersPersistence } from 'src/persistence/users/interfaces/users-persistence-interface.service';
import { StateService } from 'src/state/state.service';
import { Quad } from 'src/terrain/model/quad.model';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Character } from './model/character.model';
import { Player } from './model/player.model';

@Injectable()
export class UsersService implements BeforeApplicationShutdown {
  private readonly logger = new ConfigurableLogger(UsersService.name);

  constructor(
    @Inject(USERS_PERSISTENCE_SERVICE)
    private readonly usersPersistenceService: IUsersPersistence,
    private readonly stateService: StateService,
    private readonly configService: ConfigService,
  ) {
    stateService.players = [];
  }

  async getPlayer(playerName: string): Promise<Player> {
    return this.usersPersistenceService.getPlayer(
      playerName,
      this.stateService.terrain.mapId,
    );
  }

  async registerPlayer(newPlayer: Player): Promise<Player> {
    const position = this.stateService.terrain.getAvailableSpot();
    const newlySpawnedPlayer = new Player(
      newPlayer.name,
      position.x,
      position.y,
    );
    return await this.usersPersistenceService.registerPlayer(
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
      throw new WsException('player already connected: ' + newPlayer.name);
    }
  }

  async playerConnected(newPlayer: Player): Promise<Player> {
    let player = await this.getPlayer(newPlayer.name);
    if (!player || !player.name) {
      player = await this.registerPlayer(newPlayer);
    }
    this.stateService.players.push(player);
    return;
  }

  async registerCharacter(character: Character): Promise<Character> {
    if (!character.characterName) return;
    if (!character.uid) return;
    if (!character.mapId) character.mapId = this.stateService.terrain.mapId;
    return this.usersPersistenceService.registerCharacter(character);
  }

  playerDisconnected(playerName: string) {
    const disconnectedPlayer = this.findConnectedPlayerByName(playerName);
    if (!disconnectedPlayer) {
      this.logger.error(
        "tried to disconnect a player but couldn't find them: " + playerName,
      );
      return;
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
    if (!player) return;
    return this.getPlayersInQuad(
      Utilities.calculatePlayerFrustum(
        player,
        this.stateService.terrain,
        this.configService.get<number>('FRUSTUM_SIZE'),
      ),
    ).map((player) => _.omit(player, ['timers', 'inventory']));
  }

  private getPlayersInQuad(quad: Quad) {
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
