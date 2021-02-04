const { Server } = require('ws')
const { createServer } = require('http')
const{ default: GameServer } = require('./GameServer')

const PORT_OR_SOCKET = Number(process.env.PORT_OR_SOCKET) || 8000
const httpServer = createServer()
const wsServer = new Server({
    server: httpServer,
})
const gameServer = new GameServer(wsServer)

// gameServer.simulateLatency(60)

httpServer.listen(PORT_OR_SOCKET, () => {
    console.log(`Server is listening on: http://localhost:${PORT_OR_SOCKET}`)
})
