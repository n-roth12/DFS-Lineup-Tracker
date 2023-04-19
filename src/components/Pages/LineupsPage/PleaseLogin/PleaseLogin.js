import { Link } from 'react-router-dom'
import './PleaseLogin.scss'

const PleaseLogin = ({ message }) => {
  return (
    <div className='please-login'>
        <div className='please-login-inner'>
            <p>Please <Link className='player-link' to={`/login`}>login</Link> or <Link className='player-link' to={`/register`}>register</Link> to {message}</p>
        </div>
    </div>
  )
}

export default PleaseLogin