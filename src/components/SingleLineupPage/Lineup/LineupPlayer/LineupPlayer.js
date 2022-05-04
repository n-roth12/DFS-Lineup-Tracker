import { FaTimes } from 'react-icons/fa'
import { MdCompareArrows } from 'react-icons/md'
import './LineupPlayer.css'
import { useState } from 'react'

const LineupPlayer = ({ player, position, beingEdited, onDelete, onAdd, onOpenDialog }) => {

  var truncPoints = 0
  if (player.position == 'DST') {
    truncPoints = player.stats.fanduel_points
  } else {
    const truncPoints = Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  }
  return (
    <div className={`player ${beingEdited ? 'selected' : ''}`}>
      {player.position != 'DST' ?
        <>
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
        </>
      :
        <>
          <h3>
            <span className="pos-label">{position}</span>
            <span className="player-name" onClick={() => onOpenDialog(player)}>{player.city} {player.name} </span> 
          </h3>
          <span className="player-body">
            <p className="player-info">
              {`${player.stats.game} `}
              {player.stats.touchdowns > 0 && `| ${player.stats.touchdowns} TD `}
              {player.stats.interceptions > 0 && `| ${player.stats.interceptions} INT `}
              {player.stats.sacks > 0 && `| ${player.stats.sacks} Sacks `}
              {player.stats.safeties > 0 && `| ${player.stats.safeties} SFT `}
              {player.stats.fumble_recoveries > 0 && `| ${player.stats.fumble_recoveries} FR `}
              {player.stats.blocks > 0 && `| ${player.stats.blocks} BLK `}
              | <strong>{truncPoints}</strong> Points 
            </p>
            <div className="player-btns">
              <MdCompareArrows style={{ color: "green", cursor: "pointer", fontSize: "20pt", marginRight: "8px" }}
                onClick={() => onAdd(position)} />
              <FaTimes style={{ color: "red", cursor: "pointer", fontSize: "16pt", marginRight: "8px"}}
                onClick={() => onDelete(position)} />
            </div>
          </span>
        </>
    }
    </div>
  )
}

export default LineupPlayer