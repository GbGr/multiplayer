import { Vector3 } from '@babylonjs/core/Maths/math.vector'


const userInput = new class {
    constructor() {
        this.moveDirection = new Vector3()
        this.oldMoveDirection = new Vector3()
        this.inputChangeHandlers = []
        window.addEventListener('keydown', this._onKeyDown)
        window.addEventListener('keyup', this._onKeyUp)
    }

    onInputChange(handler) {
        this.inputChangeHandlers.push(handler)
    }

    _emitInputChange() {
        if (this.oldMoveDirection.equals(this.moveDirection)) return
        this.oldMoveDirection.copyFrom(this.moveDirection)
        this.inputChangeHandlers.forEach((handler) => handler(this.moveDirection))
    }

    _onKeyDown = (e) => {
        switch (e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.moveDirection.x = -1
                break
            case 'KeyS':
            case 'ArrowDown':
                this.moveDirection.z = -1
                break
            case 'KeyD':
            case 'ArrowRight':
                this.moveDirection.x = 1
                break
            case 'KeyW':
            case 'ArrowUp':
                this.moveDirection.z = 1
                break
            default:
                return
        }

        this.moveDirection.normalize()
        this._emitInputChange()
    }

    _onKeyUp = (e) => {
        switch (e.code) {
            case 'KeyA':
            case 'ArrowLeft':
            case 'KeyD':
            case 'ArrowRight':
                this.moveDirection.x = 0
                break
            case 'KeyS':
            case 'ArrowDown':
            case 'KeyW':
            case 'ArrowUp':
                this.moveDirection.z = 0
                break
            default:
                return
        }
        this.moveDirection.normalize()
        this._emitInputChange()
    }

}()

export default userInput
