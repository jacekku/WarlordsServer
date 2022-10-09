import { Injectable } from '@nestjs/common';
import { Player } from '@Users/domain/model/player.model';
import { PlayerConnected } from '@Users/domain/ports/command/playerConnected.port';
import { UsersService } from '@Users/usecase/users.service';

@Injectable()
export class PlayerConnectedUseCase implements PlayerConnected {
  constructor(private readonly userService: UsersService) {}

  async execute(player: Player) {
    this.userService.checkIfPlayerAlreadyConnected(player);
    await this.userService.playerConnected(player);
  }
}
