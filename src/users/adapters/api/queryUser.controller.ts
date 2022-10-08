import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Controller, UseGuards, Get, Param, Inject } from '@nestjs/common';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { GetCharacters } from '@Users/domain/ports/driving/getCharacters.port';
import { GetPlayer } from '@Users/domain/ports/driving/getPlayer.port';
import { UsersService } from '@Users/usecase/users.service';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class QueryUsersController {
  private readonly logger = new ConfigurableLogger(QueryUsersController.name);

  constructor(
    @Inject(GetPlayer) private readonly getPlayerUC: GetPlayer,
    @Inject(GetCharacters) private readonly getCharactersUC: GetCharacters,
  ) {}
  @Get(':playerName')
  async getPlayer(@Param('playerName') playerName: string): Promise<Player> {
    return this.getPlayerUC.execute(playerName);
  }

  @Get('characterList/:uid')
  async getCharacterList(@Param('uid') uid: string): Promise<Character[]> {
    return this.getCharactersUC.execute(uid);
  }
}
