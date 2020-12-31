const {PlayerHandler, Player} = require('../PlayerHandler');
require('../TerrainHandler');

test('test player moving', ()=> {
    const ph = new PlayerHandler()
    ph.registerPlayer(new Player('test',0,0))
    ph.movePlayer({name:'test'}, 1, 1)
    const player = ph.getPlayer({name:'test'})
    expect(player.x).toBe(1)
    expect(player.y).toBe(1)
})
