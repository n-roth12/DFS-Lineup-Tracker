import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import './LoginPage.scss'
import UpperNav from '../../Navbar/UpperNav/UpperNav'
import Helmet from 'react-helmet'
import { api_url } from '../../../Constants'

const LoginPage = ({ setToken, setUserId }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const loginUser = async (credentials) => {
    await axios.post(`${api_url}/users/login`, credentials)
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login | Mainslater</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </Helmet>
      <UpperNav />
      <div className="login-page">
        <div className="form-wrapper">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Username or Email</label>
            <input className="form-control" type="text" placeholder="" value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input className="form-control" type={showPassword ? "text" : "password"} placeholder="" value={password}
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
          </form>
          <button className="form-submit-btn form-control" onClick={() => handleSubmit()}>Login</button>
          <div className="register-page-link-wrapper">
            <p>Don't have an account?
              <Link to='/register' className="register-page-link">Sign up</Link></p>
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