import { Color3 } from '@babylonjs/core/Maths/math.color'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

export default function GroundFactory(scene) {
    const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 30, updatable: false }, scene)
    const groundMaterial = new StandardMaterial('groundMaterial', scene)

    groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5)
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1)
    ground.material = groundMaterial

    return ground
}
