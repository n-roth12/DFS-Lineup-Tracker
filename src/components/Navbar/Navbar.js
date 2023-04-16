import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'

const Navbar = ({ alertMessage, closeAlertMessage, alertColor }) => {

  return (
    <>
      <UpperNav />
      {window.location.pathname !== "/login" && window.location.pathname !== "/register" && 
        <LowerNav alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
      }
    </>
  )
}

export default Navbar