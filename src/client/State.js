import Queue from '../core/misc/Queue'
import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector'

const STATE_QUEUE_LENGTH = 10

const V3_BUFFER_1 = new Vector3()
const V3_BUFFER_2 = new Vector3()
const Q_BUFFER_1 = new Quaternion()
const Q_BUFFER_2 = new Quaternion()

export default class State extends Queue {
    constructor() {
        super(STATE_QUEUE_LENGTH)
    }

    getInterpolatedState(currentTime) {
        if (this.length < 2) return null

        // const freshestState = this[this.length  - 1]
        const futureState = this.find(({ time }) => time > currentTime)
        const pastState = !futureState ? null : this[this.indexOf(futureState) - 1]

        if (!futureState) {
            // TODO: extrapolation
            console.log('no future states, nearest is', this[this.length - 1].time - currentTime)
            return this[this.length - 1] // return last state
        }

        if (!pastState) return futureState

        return this.interpolateStates(pastState, futureState, currentTime)
    }

    interpolateStates(pastState, futureState, currentTime) {
        // console.log(`interpolation`, pastState, futureState, currentTime)
        const lerpFactor = (currentTime - pastState.time) / (futureState.time - pastState.time)
        const newPlayers = []
        const deletedPlayers = []
        const players = {}

        Object.keys(pastState.players).forEach((playerId) => {
            if (!futureState.players.hasOwnProperty(playerId)) {
                deletedPlayers.push(futureState.players[playerId])
            } else {
                copyVector3LikeToRef(pastState.players[playerId].position, V3_BUFFER_1)
                copyVector3LikeToRef(futureState.players[playerId].position, V3_BUFFER_2)
                const position = Vector3.Lerp(V3_BUFFER_1, V3_BUFFER_2, lerpFactor)
                players[playerId] = {...futureState.players[playerId], position }
            }
        })

        Object.keys(futureState.players).forEach((playerId) => {
            if (!pastState.hasOwnProperty(playerId)) {
                newPlayers.push(futureState.players[playerId])
            }
        })

        return {
            time: currentTime,
            players,
        }
    }

}

function copyVector3LikeToRef(source, ref) {
    ref.x = source.x
    ref.y = source.y
    ref.z = source.z
}
