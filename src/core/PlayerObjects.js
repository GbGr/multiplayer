import GameObject from './GameObject'

export default class PlayerObjects {
    constructor(scene) {
        this.scene = scene
        this.players = new Map()
    }

    createPlayer(playerEntity) {
        const playerGameObject = new GameObject(playerEntity, this.scene)

        this.players.set(playerEntity.id, playerGameObject)
    }

    updatePlayer(playerEntity) {
        const playerGameObject = this.players.get(playerEntity.id)
        playerGameObject.setFrom(playerEntity)
    }

    removePlayer(playerGameObject) {
        playerGameObject.dispose()
        this.players.delete(playerGameObject.id)
    }

    applyState({ players }, currentPlayerId) {
        Object.keys(players).forEach((playerId) => {
            if (playerId === currentPlayerId) return
            if (this.players.has(playerId)) {
                this.updatePlayer(players[playerId])
            } else {
                this.createPlayer(players[playerId])
            }
        })

        this.players.forEach((player) => {
            if (!players.hasOwnProperty(player.id)) {
                this.removePlayer(player)
            }
        })
    }
}
