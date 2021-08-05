import { Player } from "./model/Player";
import { Terrain } from "./model/Terrain";
import * as jsonConfig from './env-config.json'
import { TerrainUtilities } from "./TerrainUtilities";
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64 || jsonConfig.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const playersCollection = db.collection('players')
const mapCollection = db.collection('map')


async function getPlayer(playerName: string) {
    const mold: any[] = []
    if (playerName === 'all') {
        const snapshot = await playersCollection.get()
        snapshot.forEach((doc: any) => mold.push(doc.data()))
        return mold
    }
    const result = (await playersCollection.where('name', '==', playerName).get()).docs[0]
    if(result) {
        return result
    }
    return
}

async function registerPlayer(player: Player) {
    await playersCollection.add(player)
}

async function savePlayer(player: Player) {
    const pl = await getPlayer(player.name)
    if(pl && pl.id) {
        playersCollection.doc(pl.id).set(Object.assign({},player))
        return true
    }
    else {
        playersCollection.add(Object.assign({},player))
        return true
    }
    
}

async function saveMap(terrain: Terrain) {
    const processedTerrain: any = JSON.parse(JSON.stringify(terrain))
    await mapCollection.add({...processedTerrain, timestamp: FieldValue.serverTimestamp()})
}

async function getMostRecentMap() {
    return (await mapCollection.orderBy('timestamp', 'desc').limit(1).get()).docs[0].data()
}

async function getMap(mapId: string) {
    return (await mapCollection.doc(mapId).get()).data()
}

module.exports = {
    getPlayer,
    registerPlayer, 
    savePlayer,
    getMostRecentMap,
    saveMap,
    getMap
}