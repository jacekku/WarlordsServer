import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '@Users/usecase/users.service';
import { EVENT } from 'src/constants';

@Injectable()
export class UsersEventListener {
  constructor(private readonly userService: UsersService) {}

  @OnEvent(EVENT.PLAYER.DISCONNECTED)
  playerDisconnected(payload: { name: string }) {
    this.userService.playerDisconnected(payload.name);
  }
}
