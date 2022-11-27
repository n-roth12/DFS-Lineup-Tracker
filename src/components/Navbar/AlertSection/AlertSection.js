import './AlertSection.scss'
import { FaTimes } from 'react-icons/fa'

const AlertSection = ({ alertMessage, onClose }) => {
  return (
    <div className='alert-section'>
        <p></p>
        <p>{alertMessage}</p>
        <FaTimes className='close-btn' onClick={onClose} />
    </div>
  )
}

export default AlertSection