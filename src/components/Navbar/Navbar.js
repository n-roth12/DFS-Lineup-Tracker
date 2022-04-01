import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
  	<nav>
      <li> 
        <Link to="/login">Login</Link>
      </li>
    </nav>
  )
}

export default Navbar