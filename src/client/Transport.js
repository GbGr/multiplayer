import { statsBus } from './Stats'
import State from './State'
import InputBuffer, { Command } from './InputBuffer'

const LATENCY_CHECKS_COUNT = 5
const LATENCY_CHECK_INTERVAL = 10000

export default class Transport {
    constructor() {
        this.latency = 0
        this.clientId = null
        this.isConnected = false
        this.renderDelay = 50
        this._onCurrentPlayerStateReceivedHandlers = []
        this._onPlayersStateChangedHandlers = []
        this.latencyChecks = []
        this.state = new State()
        this.inputBuffer = new InputBuffer()
        this.client = new WebSocket(`ws://localhost:${process.env.PORT_OR_SOCKET || 8000}`)
        console.log(this)
        statsBus.onRenderDelayChange((renderDelay) => this.renderDelay = renderDelay)
    }

    connect() {
        if (this.isConnected) return Promise.resolve()

        return new Promise((resolve) => {
            this.client.onopen = (e) => {
                this.isConnected = true
                this.client.onmessage = ({ data }) => {
                    // try {
                        const message = JSON.parse(data)
                        if (!this.clientId && message.type === 'SELF_JOINED' && message.player.id) {
                            this.clientId = message.player.id
                            this._onCurrentPlayerStateReceivedHandlers.forEach((handler) => handler(message.player))
                            this.startLatencyCheck()
                            setInterval(this.startLatencyCheck, LATENCY_CHECK_INTERVAL)
                            resolve()
                        } else {
                            this.onMessage(message)
                        }
                    // } catch (e) {
                    //     console.error(e)
                    //     throw new Error('Incorrect message')
                    // }
                }
            }
        })
    }

    onMessage = (message) => {
        switch (message.type) {
            case 'STATE':
                this.onStateMessage(message)
                break
            case 'SYNC_TIME':
                this.onSyncTimeMessage(message)
                break
            default:
                console.error('no handler for message', message)
        }
    }

    onStateMessage = (message) => {
        this.state.push(message.state)
    }

    onSyncTimeMessage = ({ clientSentAt, serverSentAt }) => {
        this.latencyChecks.push({ clientSentAt, serverSentAt, receivedAt: Date.now() })

        if (this.latencyChecks.length < LATENCY_CHECKS_COUNT) {
            this.sendSyncTimeMessage()
        } else {
            this.processLatencyChecks()
        }
    }

    processLatencyChecks() {
        const latencyList = this.latencyChecks.reduce((acc, { clientSentAt, serverSentAt, receivedAt }) => {
            acc.push(((serverSentAt - clientSentAt) + (receivedAt - serverSentAt)) / 2)
            return acc
        }, [])

        this.latency = latencyList.reduce((avgLatency, latencyItem) => avgLatency + latencyItem, 0) / latencyList.length

        statsBus.emitStats('PING', this.latency * 2)
    }

    startLatencyCheck = () => {
        this.latencyChecks = []

        this.sendSyncTimeMessage()
    }

    sendSyncTimeMessage() {
        this.client.send(JSON.stringify({ type: 'SYNC_TIME', clientSentAt: Date.now() }))
    }

    onPlayersStateChanged(handler) {
        this._onPlayersStateChangedHandlers.push(handler)
    }

    onCurrentPlayerStateReceived(handler) {
        this._onCurrentPlayerStateReceivedHandlers.push(handler)
    }

    /**
     * Send command to server
     * @param command {Command}
     */
    sendCommand(command) {
        this.client.send(JSON.stringify({ type: command.name, moveDirection: { x: command.moveDirection.x, y: command.moveDirection.y, z: command.moveDirection.z } }))
    }

    _onStateChange = (newState) => {
        // statsBus.emitStats('PING', Date.now() - newState.time)
        // this._onPlayersStateChangedHandlers.forEach((handler) => handler(newState.players))
        //
        // if (!this.currentPlayerHasSpawned) {
        //     const currentPlayer = newState.players.get(this.room.sessionId)
        //
        //     if (currentPlayer) {
        //         this.currentPlayerHasSpawned = true
        //         this._onCurrentPlayerStateReceivedHandlers.forEach((handler) => handler(currentPlayer))
        //     }
        // }
    }

}
