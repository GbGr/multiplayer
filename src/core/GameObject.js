import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector'
import CharacterFactory from './Meshes/CharacterFactory'
import UserControls from './misc/UserControls'

const speed = 0.01

export default class GameObject {
    constructor(player, scene) {
        this.id = player.id
        this.scene = scene
        this.player = player
        this.controls = new UserControls()
        this.direction = new Vector3(0, 0, 0)
        this.mesh = CharacterFactory(player.id, '#000000', this.scene)
        this.mesh.position.set(player.position.x, player.position.y, player.position.z)
        this.mesh.rotationQuaternion = new Quaternion(
            player.rotationQuaternion.x,
            player.rotationQuaternion.y,
            player.rotationQuaternion.z,
            player.rotationQuaternion.w,
        )
    }

    update(deltaTime) {
        this.direction.z = this.controls.UP ? 1 : this.controls.DOWN ? -1 : 0
        this.direction.x = this.controls.RIGHT ? 1 : this.controls.LEFT ? -1 : 0
        this.direction.normalize().scaleAndAddToRef(deltaTime * speed, this.mesh.position)
    }

    /**
     * Update player controls
     * @param controls {UserControls}
     */
    applyControls(controls) {
        this.controls.updateFrom(controls)
    }

    setFrom(player) {
        this.mesh.position.set(player.position.x, player.position.y, player.position.z)

        this.mesh.rotationQuaternion.x = player.rotationQuaternion.x
        this.mesh.rotationQuaternion.y = player.rotationQuaternion.y
        this.mesh.rotationQuaternion.z = player.rotationQuaternion.z
        this.mesh.rotationQuaternion.w = player.rotationQuaternion.w
    }

    dispose() {
        this.mesh.dispose(false, true)
    }
}
