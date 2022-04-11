import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('You have succesfully logged out')
  }

  return (
  	<nav>
      <ul>
        <li>
          <Link className="navlink" to="/">Home</Link>
        </li>
        <li>
          <Link className="navlink" to="/login" onClick={() => logout()}>Logout</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar