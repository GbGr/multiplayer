const { Server } = require('colyseus')
const { createServer } = require('http')
const express = require('express')
const { monitor } = require('@colyseus/monitor')

const GameRoom = require('./GameRoom')

const PORT_OR_SOCKET = Number(process.env.PORT_OR_SOCKET) || 8000
const app = express()

app.use('/colyseus', monitor())
app.use(express.json())

const gameServer = new Server({
    server: createServer(app)
});

gameServer.simulateLatency(200)

gameServer.define('game', GameRoom, { autoDispose: false })

gameServer.listen(PORT_OR_SOCKET).then(() => {
    console.log(`API server is listening on http://localhost:${PORT_OR_SOCKET}`)
    console.log(`Game server is listening on ws://localhost:${PORT_OR_SOCKET}`)
    console.log(`Server monitor is listening on http://localhost:${PORT_OR_SOCKET}/colyseus`)
})
