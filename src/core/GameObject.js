import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector'
import CharacterFactory from './Meshes/CharacterFactory'

export default class GameObject {
    constructor(player, scene) {
        this.id = player.id
        this.scene = scene
        this.moveDirection = Vector3.Zero()
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
        this.moveDirection.scaleAndAddToRef(deltaTime * 0.01, this.mesh.position)
    }

    applyMoveDirection(moveDirection) {
        this.moveDirection.set(moveDirection.x, moveDirection.y, moveDirection.z)
    }

    sync(player) {
        // TODO: Just replace position and rotation for now
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
