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
            <div className='dropdown' onClick={() => setShowProfileDropdown(true)} onMouseLeave={() => setShowProfileDropdown(false)}>
              <FaUserAlt className='user-icon dropbtn' />
              <div className={`${!showProfileDropdown ? "hidden" : "dropdown-content"}`}>
                <a href="/feedback">Feedback</a>
                <a href="" onClick={logout}>Logout</a>
              </div>
            </div>
            :
            <div>
              {window.location.pathname === "/login" ?
                <h2 className='register-btn' onClick={() => navigate("/register")}>Sign Up</h2>
              :
                <h2 className='login-btn' onClick={() => navigate("/login")}>Sign In</h2>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default UpperNav