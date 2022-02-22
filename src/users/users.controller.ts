import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Character } from './model/character.model';
import { Player } from './model/player.model';
import { UsersService } from './users.service';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get(':playerName')
  async getPlayer(@Param('playerName') playerName: string): Promise<Player> {
    return this.userService.getPlayer(playerName);
  }

  @Post('character')
  async addCharacter(@MessageBody() character: Character): Promise<Player> {
    const newCharacter = await this.userService.registerCharacter(character);

    return await this.userService.registerPlayer({
      name: newCharacter.characterName,
    } as any);
  }

  @Get('characterList/:uid')
  async getCharacterList(@Param('uid') uid: string): Promise<Character[]> {
    return this.userService.getCharacters(uid);
  }
}
