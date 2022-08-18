import React from 'react'
import './LineupPlayerNew.scss'

function LineupPlayerNew({ player }) {
 
  const makeOpponentDisplay = (game) => {
    if (game[0].isEmphasized) {
      return `@ ${game[2]['value']}`
    }
    return game[0]['value']
  }

  return (
    <div>
      <div className='lineupPlayerNew'>
        <div className='playerImage'>
          <img src={player.playerImage50} />
        </div>
        <div className='positionAndNumber'>
          <div className='playerPosition'>{player.position}</div>
          <div className='playerNumber'>{player.teamAbbreviation}</div>
        </div>
        <div className='playerName'>
          <p>
            <span className='firstName'>{player.firstName}</span>
            <br />
            <span className='lastName'>{player.lastName}</span>
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
              <br />
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
                )["value"]}
              </span>
              <br />
              <span className='label'>
                OPRK
              </span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>
                {makeOpponentDisplay(player['competition']['nameDisplay'])}
              </span>
              <br />
              <span className='label'>
                OPP
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
        <div className='icon'>
          <div>

          </div>
        </div>
      </div> 
    </div>
  )
}

export default LineupPlayerNew