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
} from "./accessChecker"
import {
	EndpointService
} from "./endpointService"
import {
	CustomWebsocket
} from "./model/CustomWebsocket"
import {
	WebsocketsService
} from "./WebsocketsService"
import * as dotenv from 'dotenv';
const appBase = express()
const wsInstance = expressWs(appBase)
const {
	app
} = wsInstance;
const port = process.env.PORT || 8080

dotenv.config()
const websocketsService = new WebsocketsService()
const endpointService = new EndpointService()

app.use(cors({
	origin: 'https://jacekku.github.io/TraviansClient/',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(bodyParser.json())

app.get('/map', accessChecker, (req: Request, res: Response) => {
	res.send(endpointService.getWholeMap())
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
	endpointService.saveMap(endpointService.generateMap(req.params))
	res.sendStatus(200)
})

app.post('/map/reload/:mapId', accessChecker, (req: Request, res: Response) => {
	endpointService.reloadMapFromId(req.params.mapId)
	res.sendStatus(200)
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