import React from 'react'
import './PastLineupPlayer.scss'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CgArrowsExchange } from 'react-icons/cg'

function PastLineupPlayer({ player, position, beingEdited, onDelete, onAdd, onOpenDialog, toggleEditingPos, editingPos, setPlayerDialogContent, showEditing }) {

  return (
    <div className={`player pastLineupPlayer ${showEditing && beingEdited ? 'selected' : ''}`}>
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
            {player["statsDisplay"] && player["statsDisplay"].map((stat) =>
              stat["key"] !== "PTS" &&
              <span className='statsDisplay'>
                <span className='value'>{stat["value"]}</span>
                <span className='key'>{stat["key"]}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      {!showEditing ?
        <div className='icon'>
          <div>
            <p>{parseFloat(player["PTS"]).toFixed(2)}</p>
            </div>
          </div>
      :
        <div className='icon' onClick={() => toggleEditingPos(position)}>
          <div>
            <CgArrowsExchange className='add-icon' />
          </div>
        </div>
      }
    </div>
  )
}

export default PastLineupPlayer