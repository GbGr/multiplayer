import UserControls from '../core/misc/UserControls'

const userInput = new class {
    constructor() {
        this.input = new UserControls()
        this.prevInput = this.input.copy()
        this.inputChangeHandlers = []
        window.addEventListener('keydown', this._onKeyDown)
        window.addEventListener('keyup', this._onKeyUp)
    }

    onInputChange(handler) {
        this.inputChangeHandlers.push(handler)
    }

    _emitInputChange() {
        if (Object.keys(this.input).some((key) => this.input[key] !== this.prevInput[key])) {
            this.prevInput = this.input.copy()
            this.inputChangeHandlers.forEach((handler) => handler(this.input))
        }
    }

    _onKeyDown = (e) => {
        switch (e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.input.LEFT = true
                break
            case 'KeyS':
            case 'ArrowDown':
                this.input.DOWN = true
                break
            case 'KeyD':
            case 'ArrowRight':
                this.input.RIGHT = true
                break
            case 'KeyW':
            case 'ArrowUp':
                this.input.UP = true
                break
            default:
                return
        }
        this._emitInputChange()
    }

    _onKeyUp = (e) => {
        switch (e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.input.LEFT = false
                break
            case 'KeyD':
            case 'ArrowRight':
                this.input.RIGHT = false
                break
            case 'KeyS':
            case 'ArrowDown':
                this.input.DOWN = false
                break
            case 'KeyW':
            case 'ArrowUp':
                this.input.UP = false
                break
            default:
                return
        }
        this._emitInputChange()
    }

}()

export default userInput
