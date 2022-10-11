import { ConfigurableLogger } from '@Logging/logging.service';
import { Inject, Injectable } from '@nestjs/common';
import { PlayerDisconnected } from '@Users/domain/ports/command/playerDisconnected.port';
import { EventBus } from 'src/infrastructure/eventBus.port';
import { UsersService } from '@Users/usecase/users.service';
import { EVENT } from 'src/constants';

@Injectable()
export class PlayerDisconnectedUseCase implements PlayerDisconnected {
  private readonly logger = new ConfigurableLogger(
    PlayerDisconnectedUseCase.name,
  );
  constructor(
    private userService: UsersService,
    @Inject(EventBus) private eventBus: EventBus,
  ) {}

  execute(playerName: string) {
    const disconnectedPlayer =
      this.userService.findConnectedPlayerByName(playerName);
    this.eventBus.emitAsync(EVENT.PLAYER.DISCONNECTED, disconnectedPlayer);
  }
}
