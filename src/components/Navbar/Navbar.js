import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
  	<nav className="top-nav">
      <h1>{window.location.pathname === '/' ? 'History': ""}</h1>
      <ul className="top-nav-links">
        <li>
          <Link className="top-nav-link" to="/login" style={{textDecoration:"None"}} onClick={() => logout()}>Logout</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar