import { Chunk } from "../model/Chunk";
import { Player } from "../model/Player";
import { Terrain } from "../model/Terrain";
import { PermanentStorage } from "./PermanentStorage";
import * as fs from 'fs';
import {SAVE_FOLDER} from '../env-config.json'

export class FileService implements PermanentStorage {

    private PLAYER_FOLDER: string = `${SAVE_FOLDER}/mapId/players`
    private TERRAIN_FOLDER: string = `${SAVE_FOLDER}/mapId/terrain`

    getPlayer(mapId: string, playerName: string): Player| undefined {
        if(!fs.existsSync(this.getPlayersPath(mapId, playerName))) return;
        const data = fs.readFileSync(this.getPlayersPath(mapId, playerName))
        return JSON.parse(data.toString());   
     }
    getPlayers(mapId: string, players: string[]): Player[] {
        throw new Error("Method not implemented.");
    }
    registerPlayer(mapId: string, player: Player): void {
        if (!fs.existsSync(this.getPlayersPath(mapId, player.name))){
            fs.mkdirSync(this.getPlayersPath(mapId, player.name), { recursive: true });
        }
        fs.writeFileSync(this.getPlayersPath(mapId, player.name), JSON.stringify(player))
    }
    savePlayer(mapId: string, player: Player): void {
        fs.writeFileSync(this.getPlayersPath(mapId, player.name), JSON.stringify(player))
    }
    saveMap(terrain: Terrain): void {
        if (!fs.existsSync(this.getTerrainPath(terrain.mapId))){
            fs.mkdirSync(this.getTerrainPath(terrain.mapId), { recursive: true });
            fs.mkdirSync(this.getPlayersPath(terrain.mapId, "_"), {recursive: true})
        }
        terrain.chunks.forEach(
            chunk => this.saveChunk(this.getTerrainPath(terrain.mapId), chunk)
        )
        fs.writeFileSync(`${this.getTerrainPath(terrain.mapId)}/terrainData.json`, JSON.stringify(terrain))
    }
    
    getMap(mapId: string): Terrain {
        const terrainData = fs.readFileSync(`${this.getTerrainPath(mapId)}/terrainData.json`)
        const terrain: Terrain = Terrain.fromStorage(JSON.parse(terrainData.toString()));
        for ( let index = 0; index < terrain.chunkNumber; index++) {
            terrain.chunks.push(this.getChunk(terrain.mapId, index))
        }
        return terrain
    }
    getChunk(mapId: string, chunkId: number): Chunk {
        const chunkData = fs.readFileSync(`${this.getTerrainPath(mapId)}/${chunkId}.json`)
        return JSON.parse(chunkData.toString())
    }

    saveChunk(mapPath: string, chunk: Chunk): void {
        fs.writeFileSync(`${mapPath}/${chunk.id}.json`, JSON.stringify(chunk))
    }

    private getPlayersPath(mapId: string, playerName: string): string {
        return this.PLAYER_FOLDER.replace('mapId', mapId) + "/" + playerName + ".json"
    }
    private getTerrainPath(mapId: string): string {
        return this.TERRAIN_FOLDER.replace('mapId', mapId)
    }
}