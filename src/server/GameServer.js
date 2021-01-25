const Clock = require('@gamestdio/clock')
const GameSchema = require('./schemas/Game')
const PlayerSchema = require('./schemas/Player')
const Vector3Schema = require('./schemas/Vector3')
const QuaternionSchema = require('./schemas/Quaternion')
const Game = require('../core/Game').default
const ServerEngineFactory = require('../core/misc/ServerEngineFactory').default
const WebSocket = require('ws')

const randomId = () => Math.random().toString(32).slice(2, 5)

export default class GameServer {
    constructor(wsServer) {
        this.clock = new Clock()
        this.clock.getDeltaTime = () => this.clock.deltaTime // TODO
        this.wsServer = wsServer
        this.clients = new Map()
        this.gameSchema = new GameSchema()
        this.intervalId = setInterval(this.tick, 1000 / 60)

        this.engine = ServerEngineFactory()
        this.game = new Game(this.engine, this.clock)

        this.wsServer.on('connection', this.onConnection)
    }

    tick = () => {
        this.game.render()
        this.gameSchema.time = Date.now()
        this.game.playerObjects.players.forEach((player) => {
            const playerSchema = this.gameSchema.players.get(player.id)
            if (!playerSchema) throw new Error(`Player schema #${player.id} doesn't exists`)
            playerSchema.position.x = player.mesh.position.x
            playerSchema.position.y = player.mesh.position.y
            playerSchema.position.z = player.mesh.position.z
        })
        this.clients.forEach((client) => {
            client.send(JSON.stringify({ type: 'STATE', state: this.gameSchema.toJSON() }))
        })
    }

    onConnection = (wsClient) => {
        wsClient.on('close', this.onDisconnect(wsClient))
        wsClient.on('message', this.onMessage(wsClient))

        wsClient.id = randomId()
        this.clients.set(wsClient.id, wsClient)

        const newPlayer = new PlayerSchema(wsClient.id, Vector3Schema.Random(), new QuaternionSchema())
        this.gameSchema.players.set(wsClient.id, newPlayer)
        this.game.playerObjects.createPlayer(newPlayer.toJSON())

        wsClient.send(JSON.stringify({ type: 'SELF_JOINED', player: newPlayer.toJSON() }))
    }

    onMessage = (wsClient) => (message) => {
        try {
            const decodedMessage = JSON.parse(message)
            switch (decodedMessage.type) {
                case 'SYNC_TIME':
                    this.onSyncTimeMessage(wsClient, decodedMessage)
                    break
                case 'MOVE':
                    this.onMoveMessage(wsClient, decodedMessage)
                    break
                default:
                    console.error('no handler for message', decodedMessage)
            }
        } catch (e) {
            console.error(e)
        }
    }

    onDisconnect = (wsClient) => () => {
        this.clients.delete(wsClient.id)
        this.gameSchema.players.delete(wsClient.id)
    }

    simulateLatency(ms) {
        // Server send delay
        const WebSocketSend = WebSocket.prototype.send
        WebSocket.prototype.send = function (...args) {
            const self = this
            setTimeout(() => {
                WebSocketSend.apply(self, args)
            }, ms / 2)
        }
        // Server receive delay [SUPER MONKEY CODE]
        const WebSocketEmit = WebSocket.prototype.emit
        WebSocket.prototype.emit = function (...args) {
            const self = this
            if (args[0] === 'message') {
                setTimeout(() => {
                    WebSocketEmit.apply(self, args)
                }, ms / 2)
            } else {
                return WebSocketEmit.apply(self, args)
            }
        }
    }

    onSyncTimeMessage = (wsClient, message) => {
        wsClient.send(JSON.stringify({ type: 'SYNC_TIME', clientSentAt: message.clientSentAt, serverSentAt: Date.now() }))
    }

    onMoveMessage = (wsClient, { moveDirection }) => {
        const playerGameObject = this.game.playerObjects.players.get(wsClient.id)

        if (!playerGameObject) throw new Error('playerGameObject doesn\'t exists')

        playerGameObject.applyMoveDirection(moveDirection)
    }

}
