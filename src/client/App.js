import React from 'react'
import ClientEngineFactory from '../core/misc/ClientEngineFactory'
import Game from '../core/Game'
import Transport from './Transport'
import userInput from './UserInput'

export default function App() {
  const canvasRef = React.createRef()

  React.useEffect(() => {
    const engine = ClientEngineFactory(canvasRef.current)
    const game = new Game(engine)
    const transport = new Transport()

    transport.onPlayersStateChanged(game.playerObjects.onPlayersChanged)
    transport.onCurrentPlayerStateReceived(() => {
      const currentPlayerGameObject = game.playerObjects.players.get(transport.room.sessionId)
      currentPlayerGameObject.mesh.material.diffuseColor.set(1, 0, 0)
      userInput.onInputChange((moveDirection) => {
        currentPlayerGameObject.applyMoveDirection(moveDirection)
        transport.sendMoveCommand(moveDirection)
      })
    })

    transport.connect().then(() => {
      game.runRenderLoop()
    })
  }, [ canvasRef ])

  return (
      <canvas ref={canvasRef} className='renderCanvas' />
  )
}
