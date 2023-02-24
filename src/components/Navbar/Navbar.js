import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'

const Navbar = ({ alertMessage, closeAlertMessage, alertColor }) => {

  return (
    <>
      <UpperNav />
      <LowerNav alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
      </>
  )
}

export default Navbar