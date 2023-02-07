import React from 'react'
import './LineupPlayerNew.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

function LineupPlayerNew({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos }) {
 
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
      <div className={`lineupPlayerNew player ${beingEdited ? 'selected': ''}`}>
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
          {!beingEdited ?
            <div className='icon' onClick={() => toggleEditingPos(position)}>
              <div>
                <CgArrowsExchange className='add-icon' />
              </div>
            </div>
          :
          <div className='icon' onClick={() => onDelete(position)}>
            <div>
              <FaTimes className='delete-icon' />
            </div>
          </div>
          }
        </div> 
      </div>
    </div>
  )
}

export default LineupPlayerNew