import Player from './Player'

const Players = ({ players, onAdd}) => {
  return (
    <div className="players">
    	<ul>
    		{players.map((player) => (
    			<Player
    				key={player.stats.id} player={player} onAdd={onAdd} />
    		))}
    	</ul>
    </div>
  )
}

export default Players