const ticker = new class {
    constructor() {
        this._factor = 1
        this._deltaTime = 0
        this._time = Date.now()
    }

    tick() {
        this._time += (Date.now() - this._time) * this._factor
    }

    getTime() {
        return this._time
    }

    getDeltaTime() {
        return this._deltaTime
    }

}()

export default ticker
