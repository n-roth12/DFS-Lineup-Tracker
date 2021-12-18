import { FaPlus } from 'react-icons/fa'

const Player = ({ player, onAdd }) => {
  return (
    <div className="player">
      <h3 className="player-section"><span className="pos-label">{player.position}</span> { player.name }</h3>
      <div className="add-btn player-section">
        <p><FaPlus style={{ color: "#0069ed", cursor: "pointer" }}
          onClick={() => onAdd(player.stats.id)} /></p>
      </div>
      <p className="info player-section">
        Rank: { player.rank } | Fantasy Points: { player.stats.fantasy_points }
      </p>
    </div>
  )
}

export default Player