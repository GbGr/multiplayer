import React from 'react'
import Stats, { statsBus } from './Stats'
import ClientEngineFactory from '../core/misc/ClientEngineFactory'
import Game from '../core/Game'
import Transport from './Transport'
import userInput from './UserInput'
import ticker from './Ticker'
import { Command } from './InputBuffer'

export default function App() {
  const canvasRef = React.createRef()

  React.useEffect(() => {
    const engine = ClientEngineFactory(canvasRef.current)
    const game = new Game(engine, ticker)
    const transport = new Transport()

    // TODO: Monkey code
    game.preRender = () => {
      const fps = game.engine.getFps()
      statsBus.emitStats('FPS', Math.round(fps))

      game.ticker.tick()
      const state = transport.state.getInterpolatedState(game.ticker._time - transport.latency - transport.renderDelay)
      if (state) {
        game.playerObjects.applyState(state)
      }
    }

    transport.onCurrentPlayerStateReceived((playerEntity) => {
      game.playerObjects.createPlayer(playerEntity)
      const currentPlayerGameObject = game.playerObjects.players.get(transport.clientId)
      currentPlayerGameObject.mesh.material.diffuseColor.set(1, 0, 0)
      userInput.onInputChange((moveDirection) => {
        const command = new Command('MOVE', game.ticker.getTime(), moveDirection, currentPlayerGameObject.mesh.position, currentPlayerGameObject.mesh.rotationQuaternion)
        transport.inputBuffer.push(command)
        // TODO: apply command
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
