import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Controller, UseGuards, Get, Param, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { UsersService } from '@Users/usecase/users.service';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class CommandUsersController {
  private readonly logger = new ConfigurableLogger(CommandUsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Post('character')
  async addCharacter(@MessageBody() character: Character): Promise<Player> {
    this.logger.log(`creating character: ${character.characterName}`);
    const newCharacter = await this.userService.registerCharacter(character);

    this.logger.log(`creating character: ${newCharacter}`);

    return await this.userService.registerPlayer({
      name: newCharacter.characterName,
    } as any);
  }
}
