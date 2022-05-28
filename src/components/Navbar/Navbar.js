import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
  	<nav className="top-nav">
      {(window.location.pathname === '/' || window.location.pathname === '/lineups')&& 
        <h1>History</h1>
      }
      {window.location.pathname.startsWith('/lineups/') &&
        <h1>Fanduel Lineup: {window.location.pathname.split("/")[3]}, Week {window.location.pathname.split("/")[4]}</h1>
      }
      {window.location.pathname === '/upcoming' &&
        <h1>Upcoming</h1>
      }
      {window.location.pathname === '/research' &&
        <h1>Research</h1>
      }
      <ul className="top-nav-links">
        <li>
          <Link className="top-nav-link" to="/login" style={{textDecoration:"None"}} onClick={() => logout()}>Logout</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar