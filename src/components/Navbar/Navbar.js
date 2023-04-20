import './Navbar.scss'

import UpperNav from './UpperNav/UpperNav'
import LowerNav from './LowerNav/LowerNav'
import MobileNav from './MobileNav/MobileNav'
import { fallDown as Menu } from "react-burger-menu"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ alertMessage, closeAlertMessage, alertColor }) => {

  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(`/login`)
  }

  return (
    <>
      <div className='desktop-nav'>
        <UpperNav />
        {window.location.pathname !== "/login" && window.location.pathname !== "/register" &&
          <LowerNav alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
        }
      </div>
      <MobileNav />
    </>
  )
}

export default Navbar