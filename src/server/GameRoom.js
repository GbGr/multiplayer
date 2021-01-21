const { Room } = require('colyseus')
const GameSchema = require('./schemas/Game')
const PlayerSchema = require('./schemas/Player')
const Vector3Schema = require('./schemas/Vector3')
const QuaternionSchema = require('./schemas/Quaternion')
const { default: ServerEngineFactory } = require('../core/misc/ServerEngineFactory')
const { default: Game } = require('../core/Game')

class GameRoom extends Room {
    onCreate () {
        this.setState(new GameSchema())
        this.engine = ServerEngineFactory()
        this.game = new Game(this.engine)

        this.onMessage('MOVE', this.onMoveMessage)

        this.setSimulationInterval(this.tick, 1000 / 60)
    }

    onJoin(client) {
        const player = new PlayerSchema(client.id, Vector3Schema.Random(), new QuaternionSchema())
        this.state.players.set(client.id, player)
        this.game.playerObjects.onPlayersChanged(this.state.players)
    }

    onLeave(client, consented) {
        this.state.players.delete(client.id)
    }

    tick = (deltaTime) => {
        this.game.render(deltaTime)
        this.state.time = Date.now()
        this.game.playerObjects.players.forEach((player) => {
            const playerSchema = this.state.players.get(player.id)
            if (!playerSchema) throw new Error(`Player schema #${player.id} doesn't exists`)
            playerSchema.position.x = player.mesh.position.x
            playerSchema.position.y = player.mesh.position.y
            playerSchema.position.z = player.mesh.position.z
            playerSchema.rotationQuaternion.x = player.mesh.rotationQuaternion.x
            playerSchema.rotationQuaternion.y = player.mesh.rotationQuaternion.y
            playerSchema.rotationQuaternion.z = player.mesh.rotationQuaternion.z
            playerSchema.rotationQuaternion.w = player.mesh.rotationQuaternion.w
        })
    }

    onMoveMessage = (client, moveDirection) => {
        const playerGameObject = this.game.playerObjects.players.get(client.sessionId)

        if (!playerGameObject) throw new Error('playerGameObject doesn\'t exists')

        playerGameObject.applyMoveDirection(moveDirection)

    }
}

module.exports = GameRoom
