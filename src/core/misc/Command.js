const COMMAND_BUFFER = { time: 0, type: '', payload: {} }

export class Command {
    /**
     * Command entity
     * @param type {string}
     * @param time {number}
     * @param payload {object}
     * @param position {Vector3}
     * @param rotation {Quaternion}
     */
    constructor(type, time, payload, position, rotation) {
        this.type = type
        this.time = time
        this.payload = payload
        this.position = position.clone()
        this.rotation = rotation.clone()
    }

    /**
     * Serialize command for transport
     * @returns {string}
     */
    serialize() {
        COMMAND_BUFFER.time = this.time
        COMMAND_BUFFER.type = this.type
        COMMAND_BUFFER.payload = this.payload

        return JSON.stringify(COMMAND_BUFFER)
    }
}
