import React from 'react'
import './PlayerNew.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'

const  PlayerNew = ({ player }) => {
 
  const makeOpponentDisplay = (game) => {
    if (game[0].isEmphasized) {
      return `@ ${game[2]['value']}`
    }
    return game[0]['value']
  }

  return (
    <div>
      <div className='playerNew'>
        <div className='playerImage'>
          <img src={player.playerImage50} />
        </div>
        <div className='positionAndNumber'>
          <div className='playerPosition'>{player.position}</div>
          <div className='playerNumber'>{player.teamAbbreviation}</div>
        </div>
        <div className='playerData'>
          <div className='playerName'>
            <p>
                {player.firstName} {player.lastName}
            </p>
          </div>
          <div className='playerInfo'>
            <div className='infoBlock'>
                <p>
                  <span className='value'>
                    {player['draftStatAttributes'].find((stat) => 
                    stat["id"] === 90
                    )["value"]}
                  </span>
                  <span className='label'>
                      FPPG
                  </span>
                </p>
            </div>
            <div className='infoBlock'>
                <p>
                <span className='value'>
                  {player['draftStatAttributes'].find((stat) => 
                  stat['id'] === -2
                  )["value"]} ({makeOpponentDisplay(player['competition']['nameDisplay'])})
                </span>
                <br />
                <span className='label'>
                    OPRK
                </span>
                </p>
            </div>
            <div className='infoBlock'>
                <p>
                  <span className='value'>${player.salary}</span>
                  <br />
                  <span className='label'>SAL</span>
                </p>
            </div>
          </div>
        </div>
        <div className='icon'>
          <div>
            <FaPlus className='addIcon' />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default PlayerNew