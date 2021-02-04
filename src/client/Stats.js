import React from 'react'
import { BASE_RENDER_DELAY } from '../core/constants'

export const statsBus = new class {
    constructor() {
        this.stats = { FPS: 0, PING: 0, }
        this.statsChangedHandlers = []
        this.renderDelayChangeHandlers = []
        this.inputBufferHandlers = []
    }

    onInputBufferUpdate(handler) {
        this.inputBufferHandlers.push(handler)
    }

    onRenderDelayChange(handler) {
        this.renderDelayChangeHandlers.push(handler)
    }

    onStatChanged(handler) {
        this.statsChangedHandlers.push(handler)
    }

    emitStats(statKey, statValue) {
        this.stats = { ...this.stats, [statKey]: statValue }
        this.statsChangedHandlers.forEach((handler) => handler(this.stats))
    }

    emitRenderDelay(renderDelay) {
        this.renderDelayChangeHandlers.forEach((handler) => handler(renderDelay))
    }

    emitInputBufferChanges(inputBuffer) {
        this.inputBufferHandlers.forEach((handler) => handler(inputBuffer))
    }
}()

export default function Stats() {
    const [ stats, setStats ] = React.useState(statsBus.stats)
    const [ inputs, setInputs ] = React.useState([])
    const [ renderDelay, setRenderDelay ] = React.useState(BASE_RENDER_DELAY)

    React.useEffect(() => {
        statsBus.onStatChanged((newStats) => setStats(newStats))
        statsBus.onInputBufferUpdate((inputs) => setInputs(inputs))
    }, [])

    return (
        <div className='stats'>
            {Object.keys(stats).map((key) => (
                <div key={key} className='stats__item'>
                    <div className='stats__title'>{key}:</div>
                    <div className='stats__value'>{stats[key]}</div>
                </div>
            ))}
            <div className='stats__item'>
                <div className='stats__title'>{renderDelay}ms</div>
                <input
                    min={0}
                    max={500}
                    type='range'
                    value={renderDelay}
                    onChange={(e) => {
                        setRenderDelay(Number(e.target.value))
                        statsBus.emitRenderDelay(Number(e.target.value))
                    }}
                />
            </div>
            <h3>input buffer</h3>
            <div className="stats__inputs">
                {inputs.map((input, idx) => (
                    <div className='input' key={idx}>
                        <div className='input__idx'>#{idx}</div>
                        <div className='input__time'>{Date.now() - input.time}ms</div>
                    </div>
                    ))}
            </div>
        </div>
    )
}
