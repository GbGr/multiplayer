import React from 'react'

export const statsBus = new class {
    constructor() {
        this.stats = { FPS: 0, PING: 0 }
        this.statsChangedHandlers = []
    }

    onStatChanged(handler) {
        this.statsChangedHandlers.push(handler)
    }

    emitStats(statKey, statValue) {
        this.stats = { ...this.stats, [statKey]: statValue }
        this.statsChangedHandlers.forEach((handler) => handler(this.stats))
    }
}()

export default function Stats() {
    const [ stats, setStats ] = React.useState(statsBus.stats)

    React.useEffect(() => {
        statsBus.onStatChanged((newStats) => setStats(newStats))
    }, [])

    return (
        <div className='stats'>
            {Object.keys(stats).map((key) => (
                <div key={key} className='stats__item'>
                    <div className="stats__title">{key}:</div>
                    <div className="stats__valuee">{stats[key]}</div>
                </div>
            ))}
        </div>
    )
}
