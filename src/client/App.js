import React from 'react'
import Stats, { statsBus } from './Stats'
import ClientEngineFactory from '../core/misc/ClientEngineFactory'
import Game from '../core/Game'
import Transport from './Transport'
import userInput from './UserInput'
import ticker from './Ticker'
import { Command } from '../core/misc/Command'
import { INPUT_BUFFER_THRESHOLD } from '../core/constants'

export default function App() {
  const canvasRef = React.createRef()

  React.useEffect(() => {
    const engine = ClientEngineFactory(canvasRef.current)
    const game = new Game(engine, ticker)
    const transport = new Transport()
    const startAt = Date.now()

    game.preRender = () => {
      const fps = game.engine.getFps()
      statsBus.emitStats('FPS', Math.round(fps))
      const currentPlayer = game.playerObjects.players.get(transport.clientId)

      const deleteInputs = []

      if (transport.inputBuffer.length >= 2) {
        for (let i = 0; i < transport.inputBuffer.length; i++) {
          const input = transport.inputBuffer[i]
          const nextInput = transport.inputBuffer[i + 1]
          const statePosition = transport.state.getPlayerPositionByTime(transport.clientId, input.time + transport.latency)
          if (!statePosition || !nextInput) {
            continue
          }
          if (Math.abs(input.position.length() - statePosition.length()) < INPUT_BUFFER_THRESHOLD) {
            // input correct!
            deleteInputs.push(input)
          } else {
            // input incorrect

            console.error(Math.abs(input.position.length() - statePosition.length()))

            for (let j = i; j < transport.inputBuffer.length; j++) {
              const currentCommand = transport.inputBuffer[j]
              const nextCommand = transport.inputBuffer[j + 1]
              let dt = 0
              if (nextCommand) {
                dt = nextCommand.time - currentCommand.time
              } else {
                dt = game.ticker.getTime() - currentCommand.time
              }
              currentPlayer.mesh.position.x = currentCommand.position.x
              currentPlayer.mesh.position.y = currentCommand.position.y
              currentPlayer.mesh.position.z = currentCommand.position.z
              currentPlayer.applyControls(currentCommand.payload)
              currentPlayer.update(dt)
              console.warn('input reapplyed')
              deleteInputs.push(currentCommand)
            }

            transport.inputBuffer.length = 0
            break
          }
          deleteInputs.forEach((command) => {
            transport.inputBuffer.splice(transport.inputBuffer.indexOf(command), 1)
          })
        }
      }

      game.ticker.tick()

      // Interpolation
      const renderTime = game.ticker._time - transport.latency * 2 - transport.renderDelay
      const state = transport.state.getInterpolatedState(renderTime)
      if (state) {
        game.playerObjects.applyState(state, transport.clientId)
      }

      // Client prediction
      const currentPlayerGameObject = game.playerObjects.players.get(transport.clientId)
      currentPlayerGameObject.update(game.ticker.getDeltaTime())
    }

    transport.onCurrentPlayerStateReceived((playerEntity) => {
      game.playerObjects.createPlayer(playerEntity)
      const currentPlayerGameObject = game.playerObjects.players.get(transport.clientId)
      currentPlayerGameObject.mesh.material.diffuseColor.set(1, 0, 0)
      userInput.onInputChange((input) => {
        const command = new Command('MOVE', game.ticker.getTime(), input.copy(), currentPlayerGameObject.mesh.position, currentPlayerGameObject.mesh.rotationQuaternion)
        transport.inputBuffer.push(command)
        statsBus.emitInputBufferChanges(transport.inputBuffer)
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
