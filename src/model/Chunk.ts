import { Utilities } from "../Utilities";
import { Block } from "./Block";
import { Quad } from "./Quad";
import { Terrain } from "./Terrain";


export class Chunk extends Quad {
    id: number
    blocks: Block[]

    constructor(id: number, blocks: Block[], terrain: Terrain) {
        const { x, y } = Utilities.getXY(id, terrain.width / terrain.chunkSize);
        super(x * terrain.chunkSize, y * terrain.chunkSize, terrain.chunkSize, terrain.chunkSize);
        this.id = id;
        this.blocks = blocks;
    }

    static generateChunk(index: number, terrain: Terrain) {
        let blocks: Block[] = [];
        const { chunkSize } = terrain;
        const chunk: Chunk = new Chunk(index, blocks, terrain);
        for (let i = 0; i < chunkSize * chunkSize; i++) {
            blocks.push(Block.generateBlock(i, chunk));
        }
        chunk.blocks = blocks;
        return chunk;
    }
}
