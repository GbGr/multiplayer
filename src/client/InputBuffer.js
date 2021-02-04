import { Vector3, Quaternion} from '@babylonjs/core/Maths/math.vector'
import Queue from '../core/misc/Queue'

export default class InputBuffer extends Queue {
    constructor() {
        super(100)
    }
}


