import { Color3 } from '@babylonjs/core/Maths/math.color'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

export default function CharacterFactory(id, color, scene) {
    const character = MeshBuilder.CreateBox(`character_${id}`, { width: 1, depth: 1, height: 2, updatable: false }, scene)
    const characterMaterial = new StandardMaterial(`characterMaterial_${id}`, scene)

    characterMaterial.diffuseColor = Color3.FromHexString(color)
    character.material = characterMaterial

    return character
}
