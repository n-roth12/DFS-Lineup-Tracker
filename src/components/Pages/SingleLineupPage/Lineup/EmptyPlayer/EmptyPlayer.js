import { FaPlus } from 'react-icons/fa'
import './EmptyPlayer.scss'

const EmptyPlayer = ({ position, beingEdited, toggleEditingPos }) => {
  return (
    <div className={`empty-player player ${beingEdited ? 'selected': ''}`} onClick={() => {toggleEditingPos(position)}}>
      <div className='playerImage'>
      </div>
      <div className='player-info'>
        <button className="add-player-btn"><FaPlus /> Add {position}</button>
      </div>
    </div>
  )
}

export default EmptyPlayer