import React from 'react'
import './LineupPlayer.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

function LineupPlayerNew({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos, setPlayerDialogContent }) {

  return (
    <div className={`player lineupPlayer ${beingEdited ? 'selected' : ''}`}>
      <div className='playerImage'>
        <p>{position.toUpperCase()}</p>
      </div>
      <div className='name-and-info'>
        <div className='playerName'>
          <p onClick={() => setPlayerDialogContent(player)}>
            {player["firstName"]} {player["lastName"]}
          </p>
        </div>
        <div className='playerInfo'>
          <div className='infoBlock'>
            <p>
              <span className='value'>
                {parseFloat(player['fppg']).toFixed(2)}
              </span>
              <span className='label'>
                FPPG
              </span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>
                {player["game"]["awayTeam"]} @ {player["game"]["homeTeam"]}
              </span>
              <span className='label'>
                GAME
              </span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>
                {player['oprk']}
              </span>
              <span className='label'>
                OPRK
              </span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>${player["salary"]}</span>
              <span className='label'>SAL</span>
            </p>
          </div>
        </div>
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
  )
}

export default LineupPlayerNew