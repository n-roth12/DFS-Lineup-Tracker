import Player from './Player'
import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const Players = ({ players, onAdd}) => {

  const [playerFilter, setPlayerFilter] = useState('')

  const filterPlayers = (players) => {
    const results =  players.filter((player) => {
      return (playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase()))
    })
  }

  return (
    <>
      <form className="player-search-form">
        <div className="form-control">
          <label>Search Players:</label>
          <input type="text" placeholder="Search Players" value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)} />
          <div>
            <FaTimes onClick={() => setPlayerFilter('')} />
          </div>
        </div>
      </form>
      <div className="players">
    		{players.map((player) => (
          <>
            {(playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
        			<Player
        				key={player.stats.id} player={player} onAdd={onAdd} />
            }
          </>
    		))}
      </div>
    </>
  )
}

export default Players