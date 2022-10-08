import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Player } from '@Users/domain/model/player.model';
import { UsersService } from '@Users/usecase/users.service';
import { EVENT } from 'src/constants';

@Injectable()
export class UsersEventListener {
  constructor(private readonly userService: UsersService) {}

  @OnEvent(EVENT.PLAYER.DISCONNECTED, { async: true })
  playerDisconnected(payload: Player) {
    this.userService.playerDisconnected(payload);
  }
}
