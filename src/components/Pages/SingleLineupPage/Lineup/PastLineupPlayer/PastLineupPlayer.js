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
            {player["statsDisplay"] && player["statsDisplay"].map((stat) =>
              stat["key"] !== "PTS" &&
              <span className='statsDisplay'>
                <span className='value'>{stat["value"]}</span>
                <span className='key'>{stat["key"]}</span>
              </span>
            )}
          </div>
          <div className='points-block'>
            <p>{parseFloat(player["PTS"]).toFixed(2)}</p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default PastLineupPlayer