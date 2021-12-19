import Player from './Player'

const Players = ({ players, onAdd}) => {
  return (
    <div className="players">
    		{players.map((player) => (
    			<Player
    				key={player.stats.id} player={player} onAdd={onAdd} />
    		))}
    </div>
  )
}

export default Players