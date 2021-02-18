require('dotenv').config()
const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const bodyParser = require('body-parser')
const cors = require('cors');
const port = process.env.PORT || 8080
const checkAccess = require('./accessChecker')
const endpointService = require('./endpointService')
const websocketsService = require('./websocketsService')
const {terrainWrapper} = require('./TerrainHandler')

app.use(cors({
	origin: 'https://jacekku.github.io/TraviansClient/',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
app.use(bodyParser.json())

app.get('/map', accessChecker, (req, res) => {
	console.log(req.headers)
	res.send(endpointService.getWholeMap())
})

app.get('/players/:playerName', accessChecker, async (req, res) => {
	res.send(await endpointService.getPlayer(req.params.playerName))
})

app.post('/map/generate/:width-:height-:chunkSize', accessChecker, (req,res) => {
	res.send(endpointService.generateMap(req.params))
})

app.post('/map/save', (req,res) => {
	if(!checkAccess(req)) {
		res.sendStatus(403)
		return
	}
	if(!req.body){
		res.sendStatus(400)
		return
	}
	endpointService.saveMap(req.body)
})

app.post('/map/generateAndSave/:width-:height-:chunkSize', accessChecker, (req,res) => {
	endpointService.saveMap(endpointService.generateMap(req.params))
	res.sendStatus(200)
})

app.post('/map/reload/:mapId', accessChecker, (req,res) => {
	endpointService.reloadMapFromId(req.params.mapId)
	res.sendStatus(200)
})

app.ws('/ws', (ws, req) => {
	ws.on('message', (msg) => {
		websocketsService.onmessage(msg, ws, expressWs.getWss('/ws'))
	})

	ws.on('close', (msg) => {
		websocketsService.onclose(msg, ws, expressWs.getWss('/ws'))
	})
})

app.listen(port, () => {
	console.log('express listening on port: ' + port)
})
