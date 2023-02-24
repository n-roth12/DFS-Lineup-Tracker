import './PastEmptyPlayer.scss'

const PastEmptyPlayer = ({ position, showAddPlayer, onAdd, cancelEdit, beingEdited, toggleEditingPos, editingPos }) => {
  return (
    <div className={"past-empty-player player"}>
      <div className='playerImage'>
        <p>{position.toUpperCase()}</p>
      </div>
      <div className='player-info'>
        <p className="add-player-btn">Empty {position}</p>
      </div>
    </div>
  )
}

export default PastEmptyPlayer