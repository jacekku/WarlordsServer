import { Character } from '@Users/domain/model/character.model';

export abstract class GetCharacters {
  abstract execute(uid: string): Promise<Character[]>;
}
