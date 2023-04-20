import './MobileNav.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleRight } from 'react-icons/fa'

const MobileNav = () => {

  const [burgerClass, setBurgerClass] = useState("burger-bar unclicked")
  const [menuClass, setMenuClass] = useState("menu hidden")
  const [isMenuClicked, setIsMenuClicked] = useState(false)

  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked")
      setMenuClass("menu visible")
    } else {
      setBurgerClass("burger-bar unclicked")
      setMenuClass("menu hidden")
    }
    setIsMenuClicked(!isMenuClicked)
  }

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
    <div className='mobile-nav'>
      <nav>
        <h1>Mainslater</h1>
        <div className='burger-menu' onClick={updateMenu}>
          <div className={burgerClass}></div>
          <div className={burgerClass}></div>
          <div className={burgerClass}></div>
        </div>
      </nav>

      <div className={menuClass}>
        <Link className='nav-link' to={`/lineups`}>Lineups <FaAngleRight /></Link>
        <Link className='nav-link' to={`/upcoming`}>Upcoming <FaAngleRight /></Link>
        <Link className='nav-link' to={`/history`}>Players <FaAngleRight /></Link>
        <Link className='nav-link' to={'/login'} onClick={logout}>Logout <FaAngleRight /></Link>
      </div>
    </div>
  )
}

export default MobileNav