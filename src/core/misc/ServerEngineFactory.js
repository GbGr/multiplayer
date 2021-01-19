import { NullEngine } from '@babylonjs/core/Engines/nullEngine'

export default function ServerEngineFactory() {
    return new NullEngine()
}
