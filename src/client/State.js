import Queue from '../core/misc/Queue'
import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector'
import { statsBus } from './Stats'

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
        while (this.length > 2 && this[1].time < currentTime) {
            this.shift()
        }
        const futureState = this[1]
        const pastState = this[0]

        if (!pastState) return futureState


        return this.interpolateStates(pastState, futureState, currentTime)
    }

    interpolateStates(pastState, futureState, currentTime) {
        const lerpFactor = (currentTime - pastState.time) / (futureState.time - pastState.time)
        const newPlayers = []
        const deletedPlayers = []
        const players = {}

        if (lerpFactor > 1) {
            statsBus.emitStats('F_F', lerpFactor.toFixed(2))
        }

        Object.keys(pastState.players).forEach((playerId) => {
            if (!futureState.players.hasOwnProperty(playerId)) {
                deletedPlayers.push(futureState.players[playerId])
            } else {
                copyVector3LikeToRef(pastState.players[playerId].position, V3_BUFFER_1)
                copyVector3LikeToRef(futureState.players[playerId].position, V3_BUFFER_2)
                const position = Vector3.Lerp(V3_BUFFER_1, V3_BUFFER_2, Math.min(lerpFactor, 1))
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

function findLast(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i], i, array)) return array[i]
    }

    return null
}

function getNearestStateByTime(array, time) {
    let min = Number.MAX_SAFE_INTEGER
    let minItem = null

    for (const item of array) {
        const diff = Math.abs(time - item.time)
        if (diff < min) {
            min = diff
            minItem = item
        }
    }

    return minItem
}
