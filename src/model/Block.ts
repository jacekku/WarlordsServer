import { TerrainUtilities } from "../TerrainUtilities";
import { Utilities } from "../Utilities";
import { Chunk } from "./Chunk";
import { ANIMALS } from "./enums/Animals";
import { BIOMES } from "./enums/Biomes";
import { MATERIAL_RICHNESS } from "./enums/MaterialRichness";
import { MOISTURE } from "./enums/Moisture";
import { Quad } from "./Quad";

export class Block extends Quad {
    id:number
    type: BIOMES
    items: any[]
    moisture: MOISTURE
    materialRichness: MATERIAL_RICHNESS
    animals: ANIMALS

    constructor(id: number, type: BIOMES, items: any[], chunk: Chunk) {
        const x = Utilities.getXY(id, chunk.width).x + chunk.x;
        const y = Utilities.getXY(id, chunk.height).y + chunk.y;
        super(x, y, 1, 1);
        this.id = id;
        this.type = TerrainUtilities.mapToBiome(TerrainUtilities.generateValue(this.x, this.y));
        this.items = [];
        const richness = TerrainUtilities.generateItems(this.x, this.y);
        this.moisture = this.moistureMapper(richness.moisture);
        this.materialRichness = this.materialRichnessMapper(richness.materialRichness);
        this.animals = this.animalsMapper(richness.animals);
    }


    moistureMapper(value: number): MOISTURE {
        if (this.type != BIOMES.PLAIN)
            return MOISTURE.NONE;
        if (value < 50)
            return MOISTURE.DESERT;
        if (value < 150)
            return MOISTURE.FIELD;
        return MOISTURE.FOREST;
    }

    materialRichnessMapper(value: number): MATERIAL_RICHNESS {
        if (this.type != BIOMES.MOUNTAIN)
            return MATERIAL_RICHNESS.NOTHING;
        if (value < 50)
            return MATERIAL_RICHNESS.GOLD;
        if (value < 75)
            return MATERIAL_RICHNESS.IRON;
        if (value < 100)
            return MATERIAL_RICHNESS.COPPER;
        return MATERIAL_RICHNESS.NOTHING;
    }

    animalsMapper(value: number): ANIMALS {
        if (value < 75 && this.type == BIOMES.WATER)
            return ANIMALS.FISH;
        if (value < 40 && this.type == BIOMES.PLAIN)
            return ANIMALS.DEER;
        return ANIMALS.NO_ANIMAL;
    }

    static generateBlock(blockIndex: number, chunk: Chunk) {
        return new Block(blockIndex, BIOMES.PLAIN, [], chunk);
    }

}
