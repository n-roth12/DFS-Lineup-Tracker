import './SideNav.scss'
import { Link } from 'react-router-dom'
import { FaChartBar, FaBook, FaCalendarAlt } from 'react-icons/fa'

const SideNav = () => {

	console.log(window.location.pathname === '/')

  return (
    <div className="side-nav">
    	<h1>DFSTracker</h1>
    	<div>
    		<ul className="side-nav-links">
    			<li className={(window.location.pathname === '/' || window.location.pathname === '/lineups') ? 'active' : ''}>
              <Link to={'/'} 
                style={{textDecoration: "none"}} 
                className="side-nav-link"><FaBook /> History</Link>
          </li>
    			<li className={window.location.pathname === '/upcoming' ? 'active' : ''}>
            <Link to={'/upcoming'} 
              style={{textDecoration: "none"}} 
              className="side-nav-link"><FaCalendarAlt /> Upcoming</Link>
          </li>
    			<li className={window.location.pathname === '/research' ? 'active' : ''}>
            <Link to={'/research'} 
              style={{textDecoration: "none"}} 
              className="side-nav-link"><FaChartBar /> Research</Link>
          </li>
    		</ul>
    	</div>
    </div>
  )
}

export default SideNav