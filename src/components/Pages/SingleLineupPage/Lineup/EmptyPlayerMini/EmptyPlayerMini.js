import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import './EmptyPlayerMini.scss'

const EmptyPlayerMini = ({ position, showAddPlayer, onAdd, cancelEdit, beingEdited, toggleEditingPos, editingPos }) => {
  return (
    <div className={`empty-player-mini ${beingEdited ? 'selected': ''}`} onClick={() => {toggleEditingPos(position)}}>
      <p className='empty-pos-label'>Empty {position.toUpperCase()}</p>
    </div>
  )
}

export default EmptyPlayerMini