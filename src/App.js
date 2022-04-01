import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LineupsPage from './components/LineupsPage/LineupsPage'
import SingleLineupPage from './components/SingleLineupPage/SingleLineupPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'
import Navbar from './components/Navbar/Navbar'
import './App.css';
import { FaAngleLeft } from 'react-icons/fa'

function App() {

  const setToken = (userToken) => {
    sessionStorage.setItem('dfsTrackerToken', JSON.stringify(userToken))
  } 

  const setUserId = (userId) => {
    sessionStorage.setItem('dfsTrackerUserId', JSON.stringify(userId))
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={
            <>
              {sessionStorage.dfsTrackerToken ?
                <LineupsPage />
              : 
                <LoginPage setToken={setToken} />
              }
            </>
          } />

          <Route path="/login" element={
            <LoginPage setToken={setToken} />
          } />

          <Route path="/register" element={
            <RegisterPage />
          } />

          <Route path='/lineups' element={
            <LineupsPage />
          } />

          <Route path='/lineup/:lineupId/:lineupWeek/:lineupYear' element={
            <SingleLineupPage />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

