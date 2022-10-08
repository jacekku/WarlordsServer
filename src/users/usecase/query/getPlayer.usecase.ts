import { Player } from '@Common/player.model';
import { Inject } from '@nestjs/common';
import { StateService } from '@State/state.service';
import { GetPlayer } from '@Users/domain/ports/driving/getPlayer.port';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';

export class GetPlayerUseCase implements GetPlayer {
  constructor(
    @Inject(IUsersPersistence)
    private readonly usersPersistenceService: IUsersPersistence,
    private readonly stateService: StateService,
  ) {}
  async execute(playerName: string): Promise<Player> {
    return this.usersPersistenceService.getPlayer(
      playerName,
      this.stateService.terrain.mapId,
    );
  }
}
