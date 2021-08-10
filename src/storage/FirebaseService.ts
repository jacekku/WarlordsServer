import { Player } from "../model/Player";
import { Terrain } from "../model/Terrain";
import * as jsonConfig from '../env-config.json'
import { PermanentStorage } from "./PermanentStorage";
import { Chunk } from "../model/Chunk";
const admin = require('firebase-admin');


// export class FirebaseService implements PermanentStorage {
    // private FieldValue: any;
    // private database: any;
    // private playersCollection: any;
    // private mapCollection: any;
    

    // constructor() {
    //     const serviceAccount = JSON.parse(Buffer.from(jsonConfig.GOOGLE_CONFIG_BASE64 || process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))
    //     admin.initializeApp({
    //         credential: admin.credential.cert(serviceAccount)
    //     });  
    //     this.FieldValue = admin.firestore.FieldValue;
    //     this.database = admin.firestore();
    //     this.playersCollection = this.database.collection('players')
    //     this.mapCollection = this.database.collection('map')      
    // }

    // getChunk(chunkId: number): Promise<Chunk> {
    //     throw new Error("Method not implemented.");
    // }

    // async getPlayer(playerName: string): Promise<Player> {
    //     const result = (await this.playersCollection.where('name', '==', playerName).get()).docs[0]
    //     if(result) {
    //         return result
    //     }
    //     return
    // }

    // async getPlayers(players: string[]): Promise<Player[]> {
    //     const mold: Player[] = [];
    //     if (players[0] === 'all') {
    //         const snapshot = await this.playersCollection.get()
    //         snapshot.forEach((doc: any) => mold.push(doc.data()))
    //         return mold
    //     }
    //     return mold;
    // }
    
    // async registerPlayer(player: Player): Promise<void> {
    //     await this.playersCollection.add(player)
    // }
    
    // async savePlayer(player: Player): Promise<boolean> {
    //     const pl = await this.getPlayer(player.name)
    //     if(pl && pl.id) {
    //         this.playersCollection.doc(pl.id).set(Object.assign({},player))
    //         return true
    //     }
    //     else {
    //         this.playersCollection.add(Object.assign({},player))
    //         return true
    //     }
        
    // }
    
    // async saveMap(terrain: Terrain): Promise<any> {
    //     const processedTerrain: any = JSON.parse(JSON.stringify(terrain))
    //     await this.mapCollection.add({...processedTerrain, timestamp: this.FieldValue.serverTimestamp()})
    // }
    
    // async getMostRecentMap(): Promise<Terrain> {
    //     return (await this.mapCollection.orderBy('timestamp', 'desc').limit(1).get()).docs[0].data()
    // }
    
    // async getMap(mapId: string): Promise<Terrain> {
    //     return (await this.mapCollection.doc(mapId).get()).data()
    // }
    
// }


