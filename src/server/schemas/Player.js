const schema = require('@colyseus/schema')
const Vector3Schema = require('./Vector3')
const QuaternionSchema = require('./Quaternion')
const Schema = schema.Schema

class PlayerSchema extends Schema {
    constructor(id, position, rotationQuaternion) {
        super()
        this.id = id
        this.position = position
        this.rotationQuaternion = rotationQuaternion
    }
}

schema.defineTypes(PlayerSchema, {
    id: 'string',
    position: Vector3Schema,
    rotationQuaternion: QuaternionSchema,
})

module.exports = PlayerSchema
