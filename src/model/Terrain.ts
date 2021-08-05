import {
    Quad
} from "./Quad";
import {
    Chunk
} from "./Chunk";
import {
    Optional
} from "typescript-optional";

export class Terrain extends Quad {
    chunkSize: number;
    chunks: Chunk[];
    constructor(width: number, height: number, chunkSize: number, chunks: Chunk[]) {
        super(0, 0, width, height);
        this.chunkSize = chunkSize;
        this.chunks = chunks;
    }

    static generateMap(width: number, height: number, chunkSize: number, seed = Math.random()) {
        const chunks: Chunk[] = [];
        const terrain = new Terrain(width, height, chunkSize, chunks);
        for (let i = 0; i < (width / chunkSize) * (height / chunkSize); i++) {
            chunks.push(Chunk.generateChunk(i, terrain));
        }
        terrain.chunks = chunks;
        return terrain;
    }

    getWholeMap() {
        return this.chunks;
    }

    getChunkNeighbourhood(playerX: number, playerY: number) {
        const nMap = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [0, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ];
        return {
            width: this.width,
            height: this.height,
            playerChunk: this.getChunk(playerX, playerY).id,
            chunks: nMap.map(coords => this.getChunk(playerX + coords[0] * this.chunkSize, playerY + coords[1] * this.chunkSize)).filter(Boolean)
        };
    }

    getChunk(X: number, Y: number): Chunk {
        return this.chunks.find(chunk => Quad.pointInQuad(chunk, X, Y));
    }
}