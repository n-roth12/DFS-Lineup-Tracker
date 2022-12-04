import React from 'react'
import './LineupPlayerMini.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

function LineupPlayerMini({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos }) {

  return (
    <div>
        <div className={`lineup-player-mini ${beingEdited ? 'selected': ''}`}>
            <p className='position'>{position.toUpperCase()}</p>
            <p className='playerName'>{player["firstName"]} {player["lastName"]}</p>
            <p className='salary'>${player["salary"]}</p>
        </div>
    </div>
  )
}

export default LineupPlayerMini