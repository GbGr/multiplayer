const schema = require('@colyseus/schema')
const PlayerSchema = require('./Player')
const Schema = schema.Schema
const MapSchema = schema.MapSchema

class GameSchema extends Schema {
    constructor() {
        super()

        this.time = Date.now()
        this.players = new MapSchema()
    }
}

schema.defineTypes(GameSchema, {
    time: 'uint64',
    players: { map: PlayerSchema }
})

module.exports = GameSchema
