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
            <p className='icon-wrapper'><FaTimes className='delete-icon icon' /></p>
            <p className='icon-wrapper'><CgArrowsExchange className='swap-icon icon' /></p>
        </div>
    </div>
  )
}

export default LineupPlayerMini