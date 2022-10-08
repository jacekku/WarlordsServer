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
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';
import { GetPlayer } from '@Users/domain/ports/driving/getPlayer.port';

@Injectable()
export class UsersService implements BeforeApplicationShutdown {
  private readonly logger = new ConfigurableLogger(UsersService.name);

  constructor(
    @Inject(IUsersPersistence)
    private readonly usersPersistenceService: IUsersPersistence,
    private readonly stateService: StateService,
    private readonly configService: ConfigService,
    @Inject(GetPlayer) private readonly getPlayerUseCase: GetPlayer,
  ) {
    stateService.players = [];
  }

  async registerPlayer(newPlayer: Player): Promise<Player> {
    // this is not the responsibility of user service?
    const position = this.getAvailableSpotFromStateService();
    // position service?
    const newlySpawnedPlayer = new Player(
      newPlayer.name,
      position.x,
      position.y,
    );
    return await this.usersPersistenceService.savePlayer(
      newlySpawnedPlayer,
      this.getMapIdFromStateService(),
    );
  }

  movePlayer(player: Player, move: { x: number; y: number }) {
    //validatePlayerMovement()
    player = this.findConnectedPlayerInState(player);
    player.x = move.x;
    player.y = move.y;
    return player;
  }

  checkIfPlayerAlreadyConnected(newPlayer: Player) {
    if (this.findConnectedPlayerInState(newPlayer)) {
      throw new WsException('player already connected: ' + newPlayer.name);
    }
  }

  async playerConnected(newPlayer: Player): Promise<Player> {
    let player = await this.getPlayerUseCase.execute(newPlayer.name);
    if (!player || !player.name) {
      player = await this.registerPlayer(newPlayer);
    }
    this.getPlayersFromStateService().push(player);
    return;
  }

  async registerCharacter(character: Character): Promise<Character> {
    if (!character.characterName) throw new BadRequestException('NAME_EMPTY');
    if (!character.uid) throw new BadRequestException('UID_EMPTY');
    if (!character.mapId) character.mapId = this.getMapIdFromStateService();
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

    this.usersPersistenceService.savePlayer(
      disconnectedPlayer,
      this.getMapIdFromStateService(),
    );

    // TODO: move this out to state event listener
    this.stateService.players = this.getPlayersFromStateService().filter(
      (player) => player.name != disconnectedPlayer.name,
    );
  }

  findVisiblePlayers(player: Player): _.Omit<Player, 'timers' | 'inventory'>[] {
    if (!player) return;
    return this.getPlayersInQuad(
      Utilities.calculatePlayerFrustum(
        player,
        this.stateService.terrain,
        this.configService.get<number>('FRUSTUM_SIZE'),
      ),
    ).map((player) => _.omit(player, ['timers', 'inventory']));
  }

  findConnectedPlayerByName(playerName: string): Player {
    return this.findConnectedPlayerInState({ name: playerName } as Player);
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.warn('received: ' + signal + ' - saving all players');
    this.logger.warn(
      'players currently connected: ' +
        JSON.stringify(
          this.getPlayersFromStateService().map((player) => player.name),
        ),
    );
    this.getPlayersFromStateService().forEach((player) =>
      this.usersPersistenceService.savePlayer(
        player,
        this.getMapIdFromStateService(),
      ),
    );
  }

  private getPlayersInQuad(quad: Quad): Player[] {
    return this.getPlayersFromStateService().filter((player) =>
      Quad.pointInQuad(quad, player.x, player.y),
    );
  }

  // STATE QUERIES
  private getMapIdFromStateService(): string {
    return this.stateService.terrain.mapId;
  }

  private getAvailableSpotFromStateService(): { x: number; y: number } {
    return this.stateService.terrain.getAvailableSpot();
  }

  private getPlayersFromStateService(): Player[] {
    return this.stateService.players;
  }

  private findConnectedPlayerInState(playerToFind: Player): Player {
    return this.stateService.findConnectedPlayer(playerToFind);
  }
}
