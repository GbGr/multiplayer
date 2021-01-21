import { Client } from 'colyseus.js'
import { statsBus } from './Stats'

export default class Transport {
    constructor() {
        this.isConnected = false
        this.currentPlayerHasSpawned = false
        this._onCurrentPlayerStateReceivedHandlers = []
        this._onPlayersStateChangedHandlers = []
        this.client = new Client(`ws://localhost:${process.env.PORT_OR_SOCKET || 8000}`)
    }

    connect() {
        if (this.isConnected) return Promise.resolve()

        return this.client.joinOrCreate('game').then((room) => {
            this.isConnected = true
            this.room = room
            this.room.onStateChange(this._onStateChange)
        })
    }

    onPlayersStateChanged(handler) {
        this._onPlayersStateChangedHandlers.push(handler)
    }

    onCurrentPlayerStateReceived(handler) {
        this._onCurrentPlayerStateReceivedHandlers.push(handler)
    }

    sendMoveCommand(moveDirection) {
        this.room.send('MOVE', { x: moveDirection.x, y: moveDirection.y, z: moveDirection.z })
    }

    _onStateChange = (newState) => {
        statsBus.emitStats('PING', Date.now() - newState.time)
        this._onPlayersStateChangedHandlers.forEach((handler) => handler(newState.players))

        if (!this.currentPlayerHasSpawned) {
            const currentPlayer = newState.players.get(this.room.sessionId)

            if (currentPlayer) {
                this.currentPlayerHasSpawned = true
                this._onCurrentPlayerStateReceivedHandlers.forEach((handler) => handler(currentPlayer))
            }
        }
    }

}
