import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
  	<nav>
      <ul>
        <li>
          <Link className="navlink home-link" to="/">DFSTracker</Link>
        </li>
        <li>
          <Link className="navlink" to="/login" onClick={() => logout()}>Logout</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar