import { FaPlus } from 'react-icons/fa'

const Player = ({ player, onAdd }) => {
  
  const truncPoints = Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  
  return (
    <div className="player" onClick={() => onAdd(player.stats.id)} style={{cursor: "pointer"}}>
      <h3 className="player-section"><span className="pos-label">{player.position}</span> { player.name } <span className="info">({player.stats.team})</span></h3>
      <div className="add-btn player-section">
        <p><FaPlus style={{ color: "#0069ed" }}
          onClick={() => onAdd(player.stats.id)} /></p>
      </div>
      <p>
        {player.stats.game} | {player.stats.rushing_touchdowns + player.stats.passing_touchdowns + player.stats.recieving_touchdowns} TD
        | {player.stats.rushing_yards + player.stats.recieving_yards + player.stats.passing_yards} YRDS
        | <strong>{truncPoints}</strong> Points 
      </p>
    </div>
  )
}

export default Player