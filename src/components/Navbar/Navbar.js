import { Link } from 'react-router-dom'
import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'

const Navbar = () => {

  return (
  	<nav className='nav-outer'>
      <UpperNav />
      <LowerNav />
    </nav>
  )
}

export default Navbar