import { Link } from 'react-router-dom'
import './NotFound.scss'

const NotFound = () => {
  return (
    <div className='not-found'>
      <div className='not-found-inner'>
        <h1>404</h1>
        <h2>Page not found!</h2>
        <p>Try these destinations:</p>
        <div className='not-found-links'>
          <Link className='player-link' to={`/login`}>Login</Link>
          <Link className='player-link' to={`/register`}>Register</Link>
          <Link className='player-link' to={`/upcoming`}>Upcoming</Link>
          <Link className='player-link' to={`/lineups`}>Lineups</Link>
          <Link className='player-link' to={`/history`}>Players</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound