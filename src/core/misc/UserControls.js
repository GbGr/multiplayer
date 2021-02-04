export default class UserControls {
    constructor() {
        this.UP = false
        this.DOWN = false
        this.LEFT = false
        this.RIGHT = false
    }

    copy() {
        const newUserControls = new UserControls()
        newUserControls.UP = this.UP
        newUserControls.DOWN = this.DOWN
        newUserControls.LEFT = this.LEFT
        newUserControls.RIGHT = this.RIGHT

        return newUserControls
    }

    updateFrom(newControls) {
        this.UP = newControls.UP
        this.DOWN = newControls.DOWN
        this.LEFT = newControls.LEFT
        this.RIGHT = newControls.RIGHT
    }
}
