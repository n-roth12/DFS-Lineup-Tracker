import { FaTimes } from 'react-icons/fa'

const LineupPlayer = ({ player, position, onDelete }) => {

  // Round player fantasy points to two decimal places
  const truncPoints = Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100

  return (
    <div className="player">
      <h3><span className="pos-label">{position}</span> {player.name} <span className="info">({player.stats.team})</span></h3>
      <div className="delete-btn">
        <p><FaTimes style={{ color: "red", cursor: "pointer"}}
          onClick={() => onDelete(position)} /></p>
      </div>
      <div>
        <p>
          {player.stats.game} | {player.stats.rushing_touchdowns + player.stats.passing_touchdowns + player.stats.recieving_touchdowns} TD
          | {player.stats.rushing_yards + player.stats.recieving_yards + player.stats.passing_yards} YRDS
          |  <strong>{truncPoints} </strong> Points
        </p>

      </div>
    </div>
  )
}

export default LineupPlayer