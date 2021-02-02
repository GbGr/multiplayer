import { Vector3, Quaternion} from '@babylonjs/core/Maths/math.vector'
import Queue from '../core/misc/Queue'

export default class InputBuffer extends Queue {
    constructor() {
        super(100)
    }
}

export class Command {
    /**
     *
     * @param name {string}
     * @param time {number}
     * @param moveDirection {Vector3}
     * @param position {Vector3}
     * @param rotation {Quaternion}
     */
    constructor(name, time, moveDirection, position, rotation) {
        this.name = name
        this.time = time
        this.moveDirection = moveDirection
        this.position = position
        this.rotation = rotation
    }
}
