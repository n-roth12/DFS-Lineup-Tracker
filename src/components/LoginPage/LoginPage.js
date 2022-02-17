import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import './LoginPage.css'

const LoginPage = ({ setToken, setUserId }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const loginUser = async (credentials) => {
		const res = await axios.post('/users/login', credentials)
		setToken(res.data.token)
	}

	const handleSubmit = async () => {
		const token = await loginUser({
			username, password
		})
	}

	return (
		<div className="login-page">
			<div className="hero">
				<h1>Hello</h1>
			</div>
			<div className="login-form-wrapper">
				<h1>Login</h1>
				<form className="login-form" onSubmit={handleSubmit}>
		    	<div>
		    		<input className="form-control" type="text" placeholder="Username" value={username}
		    			onChange={(e) => setUsername(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Password" value={password}
		    		onChange={(e) => setPassword(e.target.value)} />
		    	</div>
		    </form>
		    <button className="form-submit-btn form-control" onClick={() => handleSubmit()}>Login</button>
		    <div className="register-page-link-wrapper">
		    	<h4>Don't have an account?      
		    	<Link to='/register' className="register-page-link">Register</Link></h4>
		    </div>
		  </div>

		</div>
	)
}

export default LoginPage

LoginPage.propTypes = {
	setToken: PropTypes.func.isRequired
}