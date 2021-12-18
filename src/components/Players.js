import Player from './Player'

const Players = ({ players, onAdd }) => {
  return (
    <div className="players-wrapper">
      <div className="players">
        <h1>Available Players</h1>
      	<ul>
      		{players.map((player) => (
      			<Player
      				key={player.stats.id} player={player} onAdd={onAdd} />
      		))}
      	</ul>
      </div>
    </div>
  )
}

export default Players