import './UpperNav.scss'

const UpperNav = () => {

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  }

  return (
    <div className='upper-nav'>
      <div className='upper-nav-inner'>
        <div>
          <h1>MainSlater</h1>
        </div>
        <div>
          <h2>Logout</h2>
        </div>
      </div>
    </div>
  )
}

export default UpperNav