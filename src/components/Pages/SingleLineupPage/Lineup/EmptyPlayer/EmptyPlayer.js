import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import './EmptyPlayer.scss'

const EmptyPlayer = ({ position, showAddPlayer, onAdd, cancelEdit, beingEdited, toggleEditingPos, editingPos }) => {
  return (
    <div className={`empty-player player ${beingEdited ? 'selected': ''}`} onClick={() => {toggleEditingPos(position)}}>
      { beingEdited ? 
        <button className="cancel-add-btn"><FaTimes /> Cancel</button>
      : <button className="add-player-btn"><FaPlus /> Add {position}</button>
      }
    </div>
  )
}

export default EmptyPlayer