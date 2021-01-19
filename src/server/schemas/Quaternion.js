const schema = require('@colyseus/schema')
const Schema = schema.Schema

class QuaternionSchema extends Schema {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        super()
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
}

schema.defineTypes(QuaternionSchema, {
    x: 'float64',
    y: 'float64',
    z: 'float64',
    w: 'float64',
})

module.exports = QuaternionSchema
