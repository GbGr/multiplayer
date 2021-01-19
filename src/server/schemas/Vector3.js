const schema = require('@colyseus/schema')
const Schema = schema.Schema

class Vector3Schema extends Schema {
    static Random(scatter = 10) {
        return new Vector3Schema(
            (Math.random() - 0.5) * scatter,
            0,
            (Math.random() - 0.5) * scatter
        )
    }

    constructor(x = 0, y = 0, z = 0) {
        super()
        this.x = x
        this.y = y
        this.z = z
    }
}
schema.defineTypes(Vector3Schema, {
    x: 'float64',
    y: 'float64',
    z: 'float64',
})

module.exports = Vector3Schema
