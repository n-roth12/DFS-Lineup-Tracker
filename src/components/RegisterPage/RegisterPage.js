import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './RegisterPage.css'

const LandingPage = () => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordCheck, setPasswordCheck] = useState('')

	const onSubmit = async () => {
		if (password === passwordCheck) {
			const params = {'username': username, 'password': password}
			const res = await axios.post('/users/register', params)
			console.log(res)
		}
	}

	const login = async () => {
		console.log(username, password)
	}

	return (
		<div className="register-page">
			<div className="hero">
				<h1>Hello</h1>
			</div>
			<div className="register-form-wrapper">
				<h1>Register</h1>
				<form className="register-form" onSubmit={onSubmit}>
		    	<div>
		    		<input className="form-control" type="text" placeholder="Enter a username" value={username}
		    			onChange={(e) => setUsername(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Enter a password" value={password}
		    		onChange={(e) => setPassword(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Re-enter password" value={passwordCheck}
		    		onChange={(e) => setPasswordCheck(e.target.value)} />
		    	</div>
		    </form>
		    <button className="form-submit-btn form-control" onClick={() => onSubmit()}>Register</button>
		    <div className="login-page-link-wrapper">
		    	<h4>Have an account?      
		    	<Link to='/login' className="login-page-link">Login</Link></h4>
		    </div>
		  </div>
		</div>
	)
}

export default LandingPage