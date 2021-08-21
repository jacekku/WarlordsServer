import { Controller, Get, Param } from '@nestjs/common';
import { Player } from '../model/player.model';
import { UsersService } from './users.service';

@Controller('players')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get(':playerName')
  getHello(@Param('playerName') playerName: string): Player {
    return this.userService.getPlayer(playerName);
  }
}
