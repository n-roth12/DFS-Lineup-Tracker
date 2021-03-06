import { Link } from 'react-router-dom'
import './Navbar.scss'

const Navbar = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  const splitName = (pathname) => {
    const temp = pathname.split('/')[2]
    return temp.replace('_', ' ')
  }

  return (
  	<nav className="top-nav">
      {(window.location.pathname === '/' || window.location.pathname === '/lineups')&& 
        <h1>Lineups</h1>
      }
      {window.location.pathname.startsWith('/lineups/') &&
        <h1>Fanduel Lineup: {window.location.pathname.split("/")[4]}, Week {window.location.pathname.split("/")[3]}</h1>
      }
      {window.location.pathname === '/upcoming' &&
        <h1>Upcoming</h1>
      }
      {window.location.pathname === '/history' &&
        <h1>History</h1>
      }
      {window.location.pathname === '/research' &&
        <h1>Research</h1>
      }
      {window.location.pathname.startsWith('/player') &&
        <h1>{splitName(window.location.pathname)}</h1>
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