import { FaTimes } from 'react-icons/fa'
import { MdCompareArrows } from 'react-icons/md'
import './LineupPlayer.css'
import { useState } from 'react'

const LineupPlayer = ({ player, position, beingEdited, onDelete, onAdd, onOpenDialog }) => {

  // Round player fantasy points to two decimal places
  const truncPoints = Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100

  return (
    <div className={`player ${beingEdited ? 'selected' : ''}`}>
      <h3><span className="pos-label">{position}</span>
          <span className="player-name" onClick={() => onOpenDialog(player)}>{player.name} </span> 
          <span className="info">({player.stats.team})</span>
      </h3>
      <span className="player-body">
        <p className="player-info">
          {player.stats.game} | {player.stats.rushing_touchdowns + player.stats.passing_touchdowns + player.stats.recieving_touchdowns} TD
          | {player.stats.rushing_yards + player.stats.recieving_yards + player.stats.passing_yards} YRDS
          |  <strong>{truncPoints} </strong> Points
        </p>
        <div className="player-btns">
          <MdCompareArrows style={{ color: "green", cursor: "pointer", fontSize: "20pt", marginRight: "8px" }}
            onClick={() => onAdd(position)} />
          <FaTimes style={{ color: "red", cursor: "pointer", fontSize: "16pt", marginRight: "8px"}}
            onClick={() => onDelete(position)} />
        </div>
      </span>
    </div>
  )
}

export default LineupPlayer