import { ConfigurableLogger } from '@Logging/logging.service';
import {
  Injectable,
  BeforeApplicationShutdown,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { StateService } from '@State/state.service';
import { Quad } from '@Terrain/model/quad.model';
import { Utilities } from '@Terrain/utilities/utilities.service';
import { Character } from 'src/common_model/character.model';
import { Player } from 'src/common_model/player.model';
import * as _ from 'lodash';
import { IUsersPersistence } from '@Users/domain/ports/users-persistence-interface.service';

@Injectable()
export class UsersServiceUseCase implements BeforeApplicationShutdown {
  private readonly logger = new ConfigurableLogger(UsersServiceUseCase.name);

  constructor(
    @Inject(IUsersPersistence)
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
    return await this.usersPersistenceService.savePlayer(
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
    if (!character.characterName) throw new BadRequestException('NAME_EMPTY');
    if (!character.uid) throw new BadRequestException('UID_EMPTY');
    if (!character.mapId) character.mapId = this.stateService.terrain.mapId;
    const characterExists = await this.getCharacter(
      character.characterName,
      character.mapId,
    );
    if (characterExists) throw new BadRequestException('EXISTS');
    return await this.usersPersistenceService.registerCharacter(character);
  }
  private async getCharacter(characterName: string, mapId: string) {
    return this.usersPersistenceService.getCharacter(characterName, mapId);
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

  async getCharacters(uid: string): Promise<Character[]> {
    return this.usersPersistenceService.getCharacters(uid);
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
