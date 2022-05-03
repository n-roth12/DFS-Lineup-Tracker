import { FaPlus } from 'react-icons/fa'

const Player = ({ player, onAdd, onOpenDialog }) => {
  
  const truncPoints = Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  
  return (
    <div className="player">
      {player.position != 'DST' ?
        <>
          <h3 className="player-section"><span className="pos-label">{player.position}</span> <span className="player-name" onClick={() => onOpenDialog(player)}>{player.name} </span><span className="info">({player.stats.team})</span></h3>
          <span className="player-body">
            <p className="player-info">
              {player.stats.game} | {player.stats.rushing_touchdowns + player.stats.passing_touchdowns + player.stats.recieving_touchdowns} TD
              | {player.stats.rushing_yards + player.stats.recieving_yards + player.stats.passing_yards} YRDS
              | <strong>{truncPoints}</strong> Points 
            </p>
            <div className="add-btn player-section">
              <p><FaPlus style={{ color: "#0069ed", fontSize: "14pt", marginRight: "8px", cursor: "pointer" }}
                onClick={() => onAdd(player.stats.id)} /></p>
            </div>
          </span>
        </>
      :
        <>
          <h3 className="player-section"><span className="pos-label">{player.position}</span> <span className="player-name" onClick={() => onOpenDialog(player)}>{player.city} {player.name}</span></h3>
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
            <div className="add-btn player-section">
              <p><FaPlus style={{ color: "#0069ed", fontSize: "14pt", marginRight: "8px", cursor: "pointer" }}
                onClick={() => onAdd(player.stats.id)} /></p>
            </div>
          </span>
        </>
      }
    </div>

  )
}

export default Player