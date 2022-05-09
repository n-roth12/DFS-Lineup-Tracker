import './SideNav.css'
import { Link } from 'react-router-dom'
import { FaChartBar, FaBook, FaCalendarAlt } from 'react-icons/fa'

const SideNav = () => {

	console.log(window.location.pathname === '/')

  return (
    <div className="side-nav">
    	<h1>DFSTracker</h1>
    	<div>
    		<ul className="side-nav-links">
    			<li className={window.location.pathname === '/' ? 'active' : ''}><Link to={'/'} style={{textDecoration: "none"}} className="side-nav-link"><FaBook /> History</Link></li>
    			<li><Link to={'/'} style={{textDecoration: "none"}} className="side-nav-link"><FaCalendarAlt /> Upcoming</Link></li>
    			<li><Link to={'/'} style={{textDecoration: "none"}} className="side-nav-link"><FaChartBar /> Research</Link></li>
    		</ul>
    	</div>
    </div>
  )
}

export default SideNav