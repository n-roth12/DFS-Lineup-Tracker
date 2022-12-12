import './LowerNav.scss'
import { Link } from 'react-router-dom'
import { FaChartBar, FaBook, FaCalendarAlt, FaListAlt } from 'react-icons/fa'

const LowerNav = () => {
  return (
    <div className='lower-nav'>
      <div className='lower-nav-inner'>
        <ul className='lower-nav-links'>
          <li className={(window.location.pathname === '/' || window.location.pathname === '/lineups') ? 'active' : ''}>
            <Link to={'/lineups'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Lineups</Link>
          </li>
          <li className={window.location.pathname === '/upcoming' ? 'active' : ''}>
            <Link to={'/upcoming'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Slates</Link>
          </li>
          <li className={window.location.pathname === '/history' ? 'active' : ''}>
            <Link to={'/history'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Players</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LowerNav