import './Footer.css'


const Footer = () => {
  return (
    <div className="footer">
    	<div className="footer-inner">
    		<p>Built by Nolan Roth, 2022</p>
    		<div className="contact">
    			<a href="https://www.linkedin.com/in/nolan-roth/">
    				<img className="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" />
    			</a>
    			<a href="https://github.com/n-roth12">
    				<img className="contact-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" />
    			</a>
    		</div>	
    	</div>
    </div>
  )
}

export default Footer