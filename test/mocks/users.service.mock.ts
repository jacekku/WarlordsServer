import { Character } from 'src/users/model/character.model';

export const userPersistanceServiceMock = {
  registerCharacter: (character) => character,
  registerPlayer: (player) => player,
  getPlayer: (playerName) => ({ name: playerName }),
} as any;

export const characterMock = {
  characterName: 'testing E2E',
  mapId: 'mapId',
  uid: 'fakeuid',
} as Character;
