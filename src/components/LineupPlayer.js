import { FaTimes } from 'react-icons/fa'

const LineupPlayer = ({ player, position, onDelete }) => {
  return (
    <div className="player">
      <h3><span className="pos-label">{ position }</span> { player.name }</h3>
      <div className="delete-btn">
        <p><FaTimes style={{ color: "red", cursor: "pointer"}}
          onClick={() => onDelete(position)} /></p>
      </div>
{/*      <div className="info">
        <p>{player.position} ({player.stats.team})</p>
      </div>
      <div>
        <p>Points: {player.stats.fantasy_points} | Game: {player.stats.game}</p>
      </div>*/}
    </div>
  )
}

export default LineupPlayer