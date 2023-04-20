import './MobileNav.scss'
import { fallDown as Menu } from "react-burger-menu"
import { Link, useNavigate } from 'react-router-dom'

const MobileNav = () => {
  return (
    <div className='mobile-nav'>
    <Menu className='bt-burger-button' noOverlay>
      <Link className='player-link' to={`/lineups`}>Lineups</Link>
      <Link className='player-link' to={`/upcoming`}>Upcoming</Link>
      <Link className='player-link' to={`/history`}>Players</Link>
      <Link className='player-link' to={`/login`}>Logout</Link>
    </Menu>
  </div>
  )
}

export default MobileNav