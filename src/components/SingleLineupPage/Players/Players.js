import Player from './Player/Player'
import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const Players = ({ players, onAdd, onOpenDialog}) => {

  const [playerFilter, setPlayerFilter] = useState('')

  const filterPlayers = (players) => {
    const results =  players.filter((player) => {
      return (playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase()))
    })
  }

  return (
    <>
      <div className="search-wrapper">
        <form className="player-search-form">
          <label className="search-label">Search Players:</label>
          <input className="" type="text" placeholder="Enter Name" value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)} />
          <div>
            <FaTimes style={{marginLeft: "10px", fontSize: "16pt"}} onClick={() => setPlayerFilter('')} />
          </div>
        </form>
      </div>
      <div className="players">
    		{players.map((player) => (
          <>
            {(playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
        			<Player
        				key={player.stats.id} player={player} onAdd={onAdd} onOpenDialog={onOpenDialog}/>
            }
          </>
    		))}
      </div>
    </>
  )
}

export default Players