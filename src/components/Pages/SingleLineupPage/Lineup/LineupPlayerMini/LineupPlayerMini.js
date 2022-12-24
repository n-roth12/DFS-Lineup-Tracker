import React from 'react'
import './LineupPlayerMini.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

const LineupPlayerMini = ({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos, deletePlayer, setSwapPlayer, playerDialogWrapper }) =>  {

  return (
    <div>
        <div className={`lineup-player-mini ${beingEdited ? 'selected': ''}`}>
            <p className='position'>{position.toUpperCase()}</p>
            <p className='player-name' onClick={() => playerDialogWrapper(player)}>
              {player ? player["firstName"] : console.log("test " + player)} {player["lastName"]}</p>
            <p className='salary'>${player["salary"]}</p>
            <p className='icon-wrapper' onClick={() => onDelete(position)}><FaTimes className='delete-icon icon' /></p>
            <p className='icon-wrapper' onClick={() => toggleEditingPos(position)} >
              <CgArrowsExchange className='swap-icon icon' /></p>
        </div>
    </div>
  )
}

export default LineupPlayerMini