import { FaPlus } from 'react-icons/fa'
import './PastEmptyPlayer.scss'

const PastEmptyPlayer = ({ position, showAddPlayer, onAdd, cancelEdit, beingEdited, toggleEditingPos, editingPos, showEditing }) => {
  return (
    <div className={`past-empty-player player ${showEditing && beingEdited ? 'selected': ''}`} 
      onClick={showEditing ? () => {toggleEditingPos(position)} : () => {}}>
      <div className='playerImage'>
        <p>{position.toUpperCase()}</p>
      </div>
      <div className='player-info'>
        {!showEditing ?
          <p className="add-player-btn">Empty {position}</p>
        :
          <button className="add-player-btn"><FaPlus /> Add {position}</button>
        }
      </div>
    </div>
  )
}

export default PastEmptyPlayer