import './UpperNav.scss'
import { useNavigate } from 'react-router-dom';

const UpperNav = () => {

  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(`/login`)
  }

  const profile = () => {
    navigate('/profile')
  }

  return (
    <div className='upper-nav'>
      <div className='upper-nav-inner'>
        <div>
          <h1>MainSlater</h1>
        </div>
        <div className='profile-btns'>
        <div>
          {window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register" && 
              <h2 className="logout-btn" onClick={profile}>Profile</h2>}
          </div>
          <div>
            {window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register" && 
              <h2 className="logout-btn" onClick={logout}>Logout</h2>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpperNav