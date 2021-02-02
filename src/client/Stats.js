import React from 'react'

export const statsBus = new class {
    constructor() {
        this.stats = { FPS: 0, PING: 0 }
        this.statsChangedHandlers = []
        this.renderDelayChangeHandlers = []
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
}()

export default function Stats() {
    const [ stats, setStats ] = React.useState(statsBus.stats)
    const [ renderDelay, setRenderDelay ] = React.useState(50)

    React.useEffect(() => {
        statsBus.onStatChanged((newStats) => setStats(newStats))
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
                    max={100}
                    type='range'
                    value={renderDelay}
                    onChange={(e) => {
                        setRenderDelay(Number(e.target.value))
                        statsBus.emitRenderDelay(Number(e.target.value))
                    }}
                />
            </div>
        </div>
    )
}
