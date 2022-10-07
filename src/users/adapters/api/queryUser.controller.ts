import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Controller, UseGuards, Get, Param, Post } from '@nestjs/common';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { UsersServiceUseCase } from '@Users/usecase/users.service';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class QueryUsersController {
  private readonly logger = new ConfigurableLogger(QueryUsersController.name);

  constructor(private readonly userService: UsersServiceUseCase) {}
  @Get(':playerName')
  async getPlayer(@Param('playerName') playerName: string): Promise<Player> {
    return this.userService.getPlayer(playerName);
  }

  @Get('characterList/:uid')
  async getCharacterList(@Param('uid') uid: string): Promise<Character[]> {
    return this.userService.getCharacters(uid);
  }
}
