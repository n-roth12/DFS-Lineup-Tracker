import { Link } from 'react-router-dom'
import './NotFound.scss'

const NotFound = () => {
  return (
    <div className='not-found'>
        <h1>Page not found!</h1>
        <p>Try these destinations:</p>
        <div className='not-found-links'>
            <Link className='player-link' to={`/login`}>Login</Link>
            <Link className='player-link' to={`/register`}>Register</Link>
            <Link className='player-link' to={`/upcoming`}>Upcoming</Link>
            <Link className='player-link' to={`/lineups`}>Lineups</Link>
        </div>
    </div>
  )
}

export default NotFound