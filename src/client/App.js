import React from 'react'
import Stats, { statsBus } from './Stats'
import ClientEngineFactory from '../core/misc/ClientEngineFactory'
import Game from '../core/Game'
import Transport from './Transport'
import userInput from './UserInput'
import ticker from './Ticker'
import { Command } from '../core/misc/Command'
import { SERVER_TICK_DURATION } from '../core/constants'

export default function App() {
  const canvasRef = React.createRef()

  React.useEffect(() => {
    const engine = ClientEngineFactory(canvasRef.current)
    const game = new Game(engine, ticker)
    const transport = new Transport()

    game.preRender = () => {
      const fps = game.engine.getFps()
      statsBus.emitStats('FPS', Math.round(fps))
      game.ticker.tick()
      const renderTime = game.ticker._time - transport.latency * 2 - SERVER_TICK_DURATION - transport.renderDelay
      const state = transport.state.getInterpolatedState(renderTime)
      if (state) {
        game.playerObjects.applyState(state, transport.clientId)
      }
      const currentPlayerGameObject = game.playerObjects.players.get(transport.clientId)
      currentPlayerGameObject.update(game.ticker.getDeltaTime())
    }

    transport.onCurrentPlayerStateReceived((playerEntity) => {
      game.playerObjects.createPlayer(playerEntity)
      const currentPlayerGameObject = game.playerObjects.players.get(transport.clientId)
      currentPlayerGameObject.mesh.material.diffuseColor.set(1, 0, 0)
      userInput.onInputChange((input) => {
        const command = new Command('MOVE', game.ticker.getTime(), input, currentPlayerGameObject.mesh.position, currentPlayerGameObject.mesh.rotationQuaternion)
        transport.inputBuffer.push(command)
        currentPlayerGameObject.applyControls(command.payload)
        transport.sendCommand(command)
      })
    })

    transport.connect().then(() => {
      game.runRenderLoop()
    })
  }, [ canvasRef ])

  return (
      <>
        <canvas ref={canvasRef} className='renderCanvas' />
        <Stats />
      </>
  )
}
