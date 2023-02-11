import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import './EmptyPlayer.scss'

const EmptyPlayer = ({ position, showAddPlayer, onAdd, cancelEdit, beingEdited, toggleEditingPos, editingPos }) => {
  return (
    <div className={`empty-player player ${beingEdited ? 'selected': ''}`} onClick={() => {toggleEditingPos(position)}}>
      <div className='playerImage'>
        <p>{position.toUpperCase()}</p>
      </div>
      <div className='player-info'>
        <button className="add-player-btn"><FaPlus /> Add {position}</button>
      </div>
    </div>
  )
}

export default EmptyPlayer