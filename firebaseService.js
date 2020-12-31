const admin = require('firebase-admin');
const serviceAccount = require('./travians-b1782447db48.json');
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const players = db.collection('players')
const map = db.collection('map')


async function getPlayer(player) {
    const mold = []
    if (player === 'all') {
        const snapshot = await players.get()
        snapshot.forEach(doc => mold.push(doc.data()))
        return mold
    }
    return (await players.where('name', '==', player).get()).docs[0].data()
}

async function savePlayer(player) {
    
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
    savePlayer, 
    getMostRecentMap,
    saveMap,
    getMap
}