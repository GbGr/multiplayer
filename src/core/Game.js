import '@babylonjs/core/sceneComponent'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import CreateGround from './Meshes/GroundFactory'
import PlayerObjects from './PlayerObjects'

export default class Game {
    constructor(engine, ticker) {
        this.engine = engine
        this.ticker = ticker
        this.scene = new Scene(this.engine)
        this.playerObjects = new PlayerObjects()
        this.camera = new UniversalCamera('camera', new Vector3(0, 20, -10), this.scene)
        this.camera.setTarget(Vector3.Zero())
        this.light = new HemisphericLight('light', Vector3.Up(), this.scene)
        this.ground = CreateGround(this.scene)
    }

    runRenderLoop = () => {
        window.addEventListener('resize', this.resize)
        this.engine.runRenderLoop(this.render)
    }

    preRender() {
        this.ticker.tick()
        const dt = this.ticker.getDeltaTime()
        this.playerObjects.players.forEach((playerGameObject) => playerGameObject.update(dt))
    }

    render = () => {
        this.preRender()
        this.scene.render()
    }

    resize = () => {
        this.engine.resize()
    }
}
