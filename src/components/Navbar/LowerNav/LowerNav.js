import './LowerNav.scss'
import { Link } from 'react-router-dom'
import { FaChartBar, FaBook, FaCalendarAlt, FaListAlt } from 'react-icons/fa'
import AlertSection from '../AlertSection/AlertSection'

const LowerNav = ({ alertMessage, closeAlertMessage, alertColor }) => {

  return (
    <div className='lower-nav'>
      <div className='lower-nav-inner'>
        <div className='lower-nav-links'>
          <Link to={'/lineups'}
            style={{ textDecoration: "none" }}
            className={`nav-link ${(window.location.pathname === '/' || window.location.pathname === '/lineups') ? 'active' : ''}`}>Lineups</Link>
          <Link to={'/upcoming'}
            style={{ textDecoration: "none" }}
            className={`nav-link ${window.location.pathname === '/upcoming' ? 'active' : ''}`}>Slates</Link>
          <Link to={'/history'}
            style={{ textDecoration: "none" }}
            className={`nav-link ${window.location.pathname === '/history' ? 'active' : ''}`}>Players</Link>
        </div>
      </div>
      {alertMessage &&
        <AlertSection alertMessage={alertMessage} onClose={closeAlertMessage} alertColor={alertColor} />
      }
    </div>
  )
}

export default LowerNav