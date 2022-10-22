import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import './EmptyPlayer.scss'

const EmptyPlayer = ({ position, showAddPlayer, onAdd, beingEdited, cancelEdit, toggleEditingPos }) => {
  return (
    <div className={`empty-player player ${beingEdited ? 'selected': ''}`} onClick={() => {toggleEditingPos(position)}}>
      <h3><span className="pos-label">{ position }</span></h3>
      { beingEdited ? 
        <button className="cancel-add-btn"><FaTimes /> Cancel</button>
      : <button className="add-player-btn"><FaPlus /> Add {position}</button>
      }
    </div>
  )
}

export default EmptyPlayer