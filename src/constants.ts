export const TERRAIN_PERSISTENCE_SERVICE = 'TERRAIN_PERSISTENCE_SERVICE';
export const BUILDINGS_PERSISTENCE_SERVICE = 'BUILDINGS_PERSISTENCE_SERVICE';
export const PERSISTENCE_TYPE = 'PERSISTENCE_TYPE';

export const WEBSOCKET = {
  SUCCESS: 'success',
  PLAYERS: {
    CONNECT: 'players:connect',
    REQUEST_UPDATE: 'players:requestUpdate',
    UPDATE: 'players:update',
    ALL: 'players:all',
    MOVE: 'players:move',
  },
};

export const EVENT = {
  PLAYER: {
    DISCONNECTED: 'event.players.disconnected',
    MOVE: 'event.players.move',
  },
  ITEMS: {
    CRAFT_REQUEST: 'event.items.craft_request',
    CRAFT_VALIDATED: 'event.items.craft_validated',
    CRAFT_FINISHED: 'event.items.craft_finished',
  },
};
