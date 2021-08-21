import { Injectable } from '@nestjs/common';
import { UsersFileService } from 'src/persistence/users/users-persistence.service';
import { Player } from '../model/player.model';

@Injectable()
export class UsersService {
  constructor(private usersPersistenceService: UsersFileService) {}

  getPlayer(playerName: string): Player {
    return this.usersPersistenceService.getPlayer(playerName);
  }
}
