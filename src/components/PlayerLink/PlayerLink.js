import { Link } from 'react-router-dom'
import './PlayerLink.scss'

function PlayerLink({ playerName }) {
  return (
    <Link className="player-link" to={`/player/${playerName.replace(" ", "_")}`}>{playerName}</Link>
  )
}

export default PlayerLink
