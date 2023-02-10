import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'

const Navbar = ({ alertMessage, closeAlertMessage}) => {

  return (
    <>
      <UpperNav />
      <LowerNav alertMessage={alertMessage} onClose={closeAlertMessage}/>
      </>
  )
}

export default Navbar