import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'
import AlertSection from './AlertSection/AlertSection'

const Navbar = ({ alertMessage, closeAlertMessage}) => {

  return (
  	<nav className='nav-outer'>
      <UpperNav />
      <LowerNav />
      {alertMessage &&
        <AlertSection alertMessage={alertMessage} onClose={closeAlertMessage} />
      }
    </nav>
  )
}

export default Navbar