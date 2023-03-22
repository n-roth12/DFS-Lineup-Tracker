import './UpperNav.scss'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa'

const UpperNav = () => {

  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(`/login`)
  }

  const profile = () => {
    navigate('/profile')
  }

  const toggleDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown)
  }

  return (
    <div className='upper-nav'>
      <div className='upper-nav-inner'>
        <div>
          <h1>MainSlater</h1>
        </div>

        <div className='profile-btns'>
          {sessionStorage.dfsTrackerToken && window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register" ?
            <div className='dropdown' onMouseOver={() => setShowProfileDropdown(true)} onMouseLeave={() => setShowProfileDropdown(false)}>
              <FaUserAlt className='user-icon dropbtn' />
              <div class={`${!showProfileDropdown ? "hidden" : "dropdown-content"}`}>
                <a href="/profile">Profile</a>
                <a href="/feedback">Feedback</a>
                <a href="#" onClick={logout}>Logout</a>
              </div>
            </div>
            :
            <div>
              {!sessionStorage.dfsTrackerToken ?
                <h2 className='logout-btn' onClick={() => navigate("/login")}>Login</h2>
                : <h2 className="logout-btn" onClick={logout}>Logout</h2>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default UpperNav