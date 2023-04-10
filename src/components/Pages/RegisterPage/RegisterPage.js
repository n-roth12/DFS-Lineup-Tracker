import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './RegisterPage.scss'
import UpperNav from '../../Navbar/UpperNav/UpperNav'
import LowerNav from '../../Navbar/LowerNav/LowerNav'
import { api_url } from '../../../Constants'

const LandingPage = ({ setToken }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordCheck, setPasswordCheck] = useState('')
	const [alert, setAlert] = useState('')
	const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')

	const onSubmit = async () => {
		if (password === passwordCheck) {
			const params = {'username': username, 'password': password, 'email': email}
			await axios.post(`${api_url}/users/register`, params)
			.then((res) => {
				setToken(res.data.token)
	    		window.location.href = "/lineups";
			})
			.catch((error) => {
				if (error.response && error.response.status === 409) {
					setAlert('Username is already in use!')
				} else {
					setAlert('An error occured!')
				}
				setPassword('')
				setPasswordCheck('')
			})
		} else {
			setAlert('Passwords do not match!')
			setPassword('')
			setPasswordCheck('')
		}
	}

	const toggle = () => {
		setShowPassword(!showPassword)
	}

	return (
		<>
		<UpperNav />
		<LowerNav />
		<div className="register-page">
			<div className="register-form-wrapper">
				<h1>Register</h1>
				<form className="register-form" onSubmit={onSubmit}>
		    	<div>
            <label>Enter Email</label>
            <input className='form-control' type="text" placeholder="" value={email}
              onChange={(e) => setEmail(e.target.value)} />
		    		<label>Create Username</label>
		    		<input className="form-control" type="text" placeholder="" value={username}
		    			onChange={(e) => setUsername(e.target.value)} />
		    		<label>Password</label>
		    		<input className="form-control" type={showPassword ? "text" : "password"} placeholder="" value={password}
		    		onChange={(e) => setPassword(e.target.value)} />
		    		<label>Re-enter Password</label>
		    		<input className="form-control" type={showPassword ? "text" : "password"} placeholder="" value={passwordCheck}
		    		onChange={(e) => setPasswordCheck(e.target.value)} />
		    		<div className="show-password">
		    			<input className="checkbox" type="checkbox" checked={showPassword} onClick={toggle} />
		    			<p>Show Password</p>
		    		</div>
		    		{alert.length > 0 &&
		    			<p className="alert">{alert}</p>
		    		}
		    	</div>
		    </form>
		    <button className="form-submit-btn form-control" onClick={() => onSubmit()}>Register</button>
		    <div className="login-page-link-wrapper">
		    	<h4>Have an account?
		    		<Link to='/login' className="login-page-link">Login</Link>
				</h4>
		    </div>
			<div><h4>Or 
					<Link to='/upcoming' className='login-page-link'>Continue as Guest</Link></h4>
			</div>
		  </div>
		</div>
		</>
	)
}

export default LandingPage
