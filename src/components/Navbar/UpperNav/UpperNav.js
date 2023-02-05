import './UpperNav.scss'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa'
import { Menu, MenuItem } from '@material-ui/core';

const UpperNav = () => {

  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <div className='user-icon-wrapper'><FaUserAlt className='user-icon' onClick={profile}/></div>
          }
          </div>
          <div>
            {window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register" && 
              <h2 className="logout-btn" onClick={logout}>Logout</h2>}
          </div>
        </div>
      </div>
      <Menu 
            className="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          />
    </div>
  )
}

export default UpperNav