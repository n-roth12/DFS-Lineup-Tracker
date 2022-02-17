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

  useEffect(() => {
    console.log(sessionStorage.token)
  }, [])

  return (
    <div className="App">
{/*      <Navbar />*/}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={
            <>
              {sessionStorage.token ?
                <LineupsPage />
              : 
                <LoginPage />
              }
            </>
          } />

          <Route path="/login" element={
            <LoginPage />
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
