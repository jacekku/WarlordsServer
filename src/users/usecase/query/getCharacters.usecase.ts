import { Inject, Injectable } from '@nestjs/common';
import { Character } from '@Users/domain/model/character.model';
import { GetCharacters } from '@Users/domain/ports/driving/getCharacters.port';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';

@Injectable()
export class GetCharactersUseCase implements GetCharacters {
  constructor(
    @Inject(IUsersPersistence)
    private readonly usersPersistenceService: IUsersPersistence,
  ) {}
  execute(uid: string): Promise<Character[]> {
    return this.usersPersistenceService.getCharacters(uid);
  }
}
