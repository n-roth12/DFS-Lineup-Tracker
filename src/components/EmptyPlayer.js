import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'

const EmptyPlayer = ({ position, showAddPlayer, onAdd, beingEdited, cancelEdit }) => {
  return (
    <div className="empty-player player">
      <h3><span className="pos-label">{ position }</span></h3>
      { beingEdited ? 
        <button className="cancel-add-btn"
          onClick={() => {cancelEdit()}}><FaTimes /> Cancel</button>
      : <button className="add-player-btn" 
          onClick={() => {onAdd(position)}}><FaPlus /> Add {position}</button>
      }
    </div>
  )
}

export default EmptyPlayer