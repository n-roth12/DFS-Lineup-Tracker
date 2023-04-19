import './Footer.scss'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="footer">
    	<div className="footer-inner">
			<div>
				<h3>Mainslater</h3>
			</div>
			<div className='footer-links'>
				<Link className='player-link' to={`/terms`}>Terms</Link>
				<Link className='player-link' to={`/feedback`}>Contact</Link>
			</div>
    	</div>
    </div>
  )
}

export default Footer