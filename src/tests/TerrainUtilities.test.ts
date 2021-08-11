import { TerrainUtilities } from "../TerrainUtilities"
var Simplex = require('perlin-simplex')


test('basic', () => {
    console.log(TerrainUtilities.generateValue(0,0))
    console.log(TerrainUtilities.generateValue(0,1))
    console.log(TerrainUtilities.generateValue(1,0))
    console.log(TerrainUtilities.generateValue(1,1))

    expect(1).toBe(1)
})