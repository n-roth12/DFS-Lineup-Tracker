import React from 'react'
import './LineupPlayerNew.scss'
import { FaPlus } from 'react-icons/fa'

function LineupPlayerNew({ player }) {
 
  const makeOpponentDisplay = (game) => {
    if (game && game["nameDisplay"]) {
      if (game["nameDisplay"][0].isEmphasized) {
        return `@ ${game["nameDisplay"][2]['value']}`
      }
      return game["nameDisplay"][0]['value']
    } else {
      return "-"
    }
  }

  return (
    <div>
      <div className='lineupPlayerNew'>
        <div className='playerImage'>
          <img src={player["playerImage160"]} />
        </div>
        <div className='positionAndNumber'>
          <div className='playerPosition'>{player["position"]}</div>
          <div className='playerNumber'>{player["teamAbbreviation"]}</div>
        </div>
        <div className='playerName'>
          <p>
            <span className='firstName'>{player["firstName"]}</span>
            <br />
            <span className='lastName'>{player["lastName"]}</span>
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
                {makeOpponentDisplay(player['competition'])}
              </span>
              <br />
              <span className='label'>
                OPP
              </span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>${player["salary"]}</span>
              <br />
              <span className='label'>SAL</span>
            </p>
          </div>
          <div className='icon'>
            <div>
              <FaPlus className='addIcon' />
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default LineupPlayerNew