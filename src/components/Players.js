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
      <div>
        <form className="player-search-form">
          <label>Search Players:</label>
          <input type="text" placeholder="Search Players" value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)} />
          <div>
            <FaTimes onClick={() => setPlayerFilter('')} />
          </div>
        </form>
      </div>
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