import {
    Chunk
} from "../model/Chunk";
import {
    Player
} from "../model/Player";
import {
    Terrain
} from "../model/Terrain";

export interface PermanentStorage {
    getPlayer(mapId: string, playerName: string): Player;

    getPlayers(mapId: string, players: string[]): Player[];

    registerPlayer(mapId: string, player: Player): void;

    savePlayer(mapId: string, player: Player): void;

    saveMap(terrain: Terrain): void;

    getMap(mapId: string): Terrain;

    getChunk(mapId: string, chunkId: number): Chunk;
}