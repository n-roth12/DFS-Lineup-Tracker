import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LineupsPage from './components/LineupsPage/LineupsPage'
import SingleLineupPage from './components/SingleLineupPage/SingleLineupPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'
import UpcomingPage from './components/UpcomingPage/UpcomingPage'
import HistoryPage from './components/HistoryPage/HistoryPage'
import ResearchPage from './components/ResearchPage/ResearchPage'
import Navbar from './components/Navbar/Navbar'
import SideNav from './components/SideNav/SideNav'
import Footer from './components/Footer/Footer'
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
          <Route path="/">
            <Route index element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <SideNav />
                      <LineupsPage />
                    </div>
                    <Footer />
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="login" element={
              <LoginPage setToken={setToken} />
            } />

            <Route path="register" element={
              <RegisterPage setToken={setToken} />
            } />

            <Route path="lineups">
              <Route index element={
                <>
                  {sessionStorage.dfsTrackerToken ?
                    <div className="page-wrapper">
                      <Navbar />
                      <div className="page-wrapper-inner"> 
                        <SideNav />
                        <LineupsPage />
                      </div>
                      <Footer />
                    </div>
                  : 
                    <LoginPage setToken={setToken} />
                  }
                </>
              } />

              <Route path=":lineupId/:lineupWeek/:lineupYear" element={
                <>
                  {sessionStorage.dfsTrackerToken ?
                    <div className="page-wrapper">
                      <Navbar />
                      <div className="page-wrapper-inner"> 
                        <SideNav />
                        <SingleLineupPage  />
                      </div>
                      <Footer />
                    </div>
                  : 
                    <LoginPage setToken={setToken} />
                  }
                </>
              } />
            </Route>

            <Route path="upcoming" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <SideNav />
                      <UpcomingPage week={18} year={2021} />
                    </div>
                    <Footer />
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="research" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <SideNav />
                      <ResearchPage />
                    </div>
                    <Footer />
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="history" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <SideNav />
                      <HistoryPage />
                    </div>
                    <Footer />
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

