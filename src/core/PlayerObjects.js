import GameObject from './GameObject'

export default class PlayerObjects {
    constructor(scene) {
        this.scene = scene
        this.players = new Map()
    }

    onPlayersChanged = (playersMap) => {
        playersMap.forEach((player) => {
            if (this.players.has(player.id)) this.updatePlayer(player)
            else this.createPlayer(player)
        })

        this.players.forEach((playerGameObject) => {
            if (!playersMap.has(playerGameObject.id)) {
                this.removePlayer(playerGameObject)
            }
        })
    }

    createPlayer(player) {
        const playerGameObject = new GameObject(player, this.scene)

        this.players.set(player.id, playerGameObject)
    }

    updatePlayer(player) {
        const playerGameObject = this.players.get(player.id)
        playerGameObject.sync(player)
    }

    removePlayer(playerGameObject) {
        playerGameObject.dispose()
        this.players.delete(playerGameObject.id)
    }
}
