import { Engine } from '@babylonjs/core/Engines/engine'

export default function ClientEngineFactory(htmlCanvasElement) {
    return new Engine(htmlCanvasElement, false, {}, true)
}
