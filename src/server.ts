import bodyParser from "body-parser"
import cors from "cors"
import express, {
	Request,
	Response
} from "express"
import expressWs from "express-ws"
import WebSocket from "ws"
import {
	accessChecker
} from "./middleware/AccessChecker"
import {
	EndpointService
} from "./EndpointService"
import {
	CustomWebsocket
} from "./model/CustomWebsocket"
import {
	WebsocketsService
} from "./WebsocketsService"
import * as dotenv from 'dotenv';
import {
	FileService
} from "./storage/FileService"
import {
	TerrainWrapper
} from "./TerrainHandler"
import {
	PlayerService
} from "./PlayerService"
import {
	PermanentStorage
} from "./storage/PermanentStorage"
const appBase = express()
const wsInstance = expressWs(appBase)
const {
	app
} = wsInstance;
const port = process.env.PORT || 8080

dotenv.config()

const permanentStorage: PermanentStorage = new FileService();

const websocketsService = new WebsocketsService(new PlayerService(permanentStorage, TerrainWrapper.getInstance()), TerrainWrapper.getInstance())
const endpointService = new EndpointService(TerrainWrapper.getInstance(), permanentStorage)

app.use(cors({
	// origin: 'https://jacekku.github.io/TraviansClient/',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(bodyParser.json())

app.get('/map', accessChecker, (req: Request, res: Response) => {
	res.send(endpointService.getWholeMap(req, res))
})

app.get('/players/:playerName', accessChecker, async (req: Request, res: Response) => {
	res.send(await endpointService.getPlayer(req.params.playerName))
})

app.post('/map/generate/:width-:height-:chunkSize', accessChecker, (req: Request, res: Response) => {
	res.send(endpointService.generateMap(req.params))
})

app.post('/map/save', accessChecker, (req: Request, res: Response) => {
	if (!req.body) {
		res.sendStatus(400)
		return
	}
	endpointService.saveMap(req.body)
})

app.post('/map/generateAndSave/:width-:height-:chunkSize', accessChecker, (req: Request, res: Response) => {
	res.send(
		endpointService.saveMap(
			endpointService.generateMap(req.params)
		)
	)
})

app.post('/map/reload/:mapId', accessChecker, (req: Request, res: Response) => {
	endpointService.reloadMapFromId(req.params.mapId)
	res.sendStatus(200)
})


app.get('/map/chunk/:chunkId', accessChecker, (req: Request, res: Response) => {
	res.send(endpointService.getChunk(req.params.chunkId))
})

app.ws('/ws', (ws: WebSocket) => {
	ws.on('message', (msg: string) => {
		websocketsService.onmessage(msg, ws as CustomWebsocket, wsInstance.getWss())
	})

	ws.on('close', (msg: string) => {
		websocketsService.onclose(msg, ws as CustomWebsocket, wsInstance.getWss())
	})
})

app.listen(port, () => {
	console.log('express listening on port: ' + port)
})