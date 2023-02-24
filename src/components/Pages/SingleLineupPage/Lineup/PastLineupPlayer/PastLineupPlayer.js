import React from 'react'
import './PastLineupPlayer.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

function PastLineupPlayer({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos, setPlayerDialogContent }) {

  return (
    <div className={`player pastLineupPlayer ${beingEdited ? 'selected' : ''}`}>
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
              <span className='value'>123 YDS, 2TDs</span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>{player["game"]["awayTeam"]} 17 @ {player["game"]["homeTeam"]} 24</span>
            </p>
          </div>
          <div className='infoBlock'>
            <p>
              <span className='value'>${player["salary"]}</span>
            </p>
          </div>
          <div className='points-block'>
            <p>18.3</p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default PastLineupPlayer