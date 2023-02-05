import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import './LoginPage.scss'
import UpperNav from '../../Navbar/UpperNav/UpperNav'
import LowerNav from '../../Navbar/LowerNav/LowerNav'

const LoginPage = ({ setToken, setUserId }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [alert, setAlert] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const loginUser = async (credentials) => {
		await axios.post('/users/login', credentials)
		.then((res) => {
			if (res.status === 200) {
				setToken(res.data.token)
	    		window.location.href = "/lineups";
	    	}
		})
		.catch((error) => {
			if (error.response && error.response.status === 403) {
				setAlert('Incorrect username or password!')
			} else {
				setAlert('An error occured!')
			}
			setPassword('')
		})
	}

	const handleSubmit = async () => {
		const token = await loginUser({
			username, password
		})
	}

	const toggle = () => {
		setShowPassword(!showPassword)
	}

	return (
		<>
		<UpperNav />
		<LowerNav />
		<div className="login-page">
			<div className="login-form-wrapper">
				<h1>Login</h1>
				<form className="login-form" onSubmit={handleSubmit}>
			    	<div>
			    		<label>Username</label>
			    		<input className="form-control" type="text" placeholder="Enter Username" value={username}
			    			onChange={(e) => setUsername(e.target.value)} />
			    		<label>Password</label>
			    		<input className="form-control" type={showPassword ? "text" : "password"} placeholder="Enter Password" value={password}
			    		onChange={(e) => setPassword(e.target.value)} />
			    		<div className="show-password">
			    			<input className="checkbox" type="checkbox" checked={showPassword} onClick={toggle} />
			    			<p>Show Password</p>
			    		</div>
			    		{alert.length > 0 &&
			    			<>
			    				<p className="alert">{alert}</p>
			    			</>
			    		}
			    	</div>
			    </form>
			    <button className="form-submit-btn form-control" onClick={() => handleSubmit()}>Login</button>
			    <div className="register-page-link-wrapper">
			    	<h4>Don't have an account?
			    	<Link to='/register' className="register-page-link">Register</Link></h4>
			    </div>
			</div>
		</div>
		</>
	)
}

export default LoginPage

LoginPage.propTypes = {
	setToken: PropTypes.func.isRequired
}