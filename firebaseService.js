const admin = require('firebase-admin');
const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const players = db.collection('players')
const map = db.collection('map')


async function getPlayer(playerName) {
    const mold = []
    if (playerName === 'all') {
        const snapshot = await players.get()
        snapshot.forEach(doc => mold.push(doc.data()))
        return mold
    }
    const result = (await players.where('name', '==', playerName).get()).docs[0]
    if(result) {
        return result
    }
    return
}

async function registerPlayer(player) {
    await players.add(player)
}

async function savePlayer(player) {
    const pl = await this.getPlayer(player.name)
    if(pl && pl.id) {
        players.doc(pl.id).set(Object.assign({},player))
        return true
    }
    else {
        players.add(Object.assign({},player))
        return true
    }
    
}

async function saveMap(terrain) {
    await map.add({terrain, timestamp: FieldValue.serverTimestamp()})
}

async function getMostRecentMap() {
    return (await map.orderBy('timestamp', 'desc').limit(1).get()).docs[0].data()
}

async function getMap(mapId) {
    return (await map.doc(mapId).get()).data()
}

module.exports = {
    getPlayer,
    registerPlayer, 
    savePlayer,
    getMostRecentMap,
    saveMap,
    getMap
}