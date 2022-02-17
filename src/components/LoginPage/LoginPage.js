import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './LoginPage.css'

const LoginPage = () => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const onSubmit = async () => {
		const params = {'username': username, 'password': password}
		const res = await axios.post('/users/login', params)
		console.log(res)
	}

	const login = async () => {
		console.log(username, password)
	}

	return (
		<div className="login-page">
			<div className="hero">
				<h1>Hello</h1>
			</div>
			<div className="login-form-wrapper">
				<h1>Login</h1>
				<form className="login-form" onSubmit={onSubmit}>
		    	<div>
		    		<input className="form-control" type="text" placeholder="Username" value={username}
		    			onChange={(e) => setUsername(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Password" value={password}
		    		onChange={(e) => setPassword(e.target.value)} />
		    	</div>
		    </form>
		    <button className="form-submit-btn form-control" onClick={() => onSubmit()}>Login</button>
		    <div className="register-page-link-wrapper">
		    	<h4>Don't have an account?      
		    	<Link to='/register' className="register-page-link">Register</Link></h4>
		    </div>
		  </div>

		</div>
	)
}

export default LoginPage