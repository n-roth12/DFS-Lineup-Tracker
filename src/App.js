import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Players from './components/Players'
import Lineup from './components/Lineup'
import LineupsPage from './components/LineupsPage'
import SingleLineupPage from './components/SingleLineupPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'
import Navbar from './components/Navbar'
import './App.css';
import { FaAngleLeft } from 'react-icons/fa'

function App() {
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)


  const test2 = () => {
    console.log('test')
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={
            <>
              {token ?
                <LineupsPage />
              : 
                <LoginPage setToken={setToken} />
              }
            </>
          } />

          <Route path="/login" element={
            <LoginPage setToken={setToken}/>
          } />

          <Route path="register" element={
            <RegisterPage />
          } />

          <Route path='/lineups' element={
            <LineupsPage />
          } />

          <Route path='/lineups/lineup/:lineupId/:lineupWeek/:lineupYear' element={
            <SingleLineupPage />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

