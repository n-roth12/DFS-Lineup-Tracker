import './LowerNav.scss'
import { Link } from 'react-router-dom'
import { FaChartBar, FaBook, FaCalendarAlt, FaListAlt } from 'react-icons/fa'

const LowerNav = () => {
  return (
    <div className='lower-nav'>
      <div className='lower-nav-inner'>
        <ul className='lower-nav-links'>
          <li className={(window.location.pathname === '/' || window.location.pathname === '/lineups') ? 'active' : ''}>
            <Link to={'/'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Lineups</Link>
          </li>
          <li className={window.location.pathname === '/upcoming' ? 'active' : ''}>
            <Link to={'/upcoming'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Upcoming</Link>
          </li>
          <li className={window.location.pathname === '/history' ? 'active' : ''}>
            <Link to={'/history'} 
              style={{textDecoration: "none"}} 
              className="nav-link">History</Link>
          </li>
          <li className={window.location.pathname === '/research' ? 'active' : ''}>
            <Link to={'/research'} 
              style={{textDecoration: "none"}} 
              className="nav-link">Research</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LowerNav