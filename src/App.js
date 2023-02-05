import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LineupsPage from './components/Pages/LineupsPage/LineupsPage'
import SingleLineupPage from './components/Pages/SingleLineupPage/SingleLineupPage'
import LoginPage from './components/Pages/LoginPage/LoginPage'
import RegisterPage from './components/Pages/RegisterPage/RegisterPage'
import UpcomingPage from './components/Pages/UpcomingPage/UpcomingPage'
import HistoryPage from './components/Pages/HistoryPage/HistoryPage'
import ResearchPage from './components/Pages/ResearchPage/ResearchPage'
import CreateLineupPage from './components/Pages/CreateLineupPage/CreateLineupPage'
import PlayerPage from './components/Pages/PlayerPage/PlayerPage'
import CompareLineupsPage from './components/Pages/CompareLineupsPage/CompareLineupsPage';
import ProfilePage from './components/Pages/ProfilePage/ProfilePage';
import FeedbackPage from './components/Pages/FeedbackPage/FeedbackPage';
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import './App.css';
import { FaAngleLeft } from 'react-icons/fa'
import {ScrollToTop} from './ScrollToTop';
function App() {
  
  const [alertMessage, setAlertMessage] = useState()

  useEffect(() =>{
    document.title = "Mainslater"
  })

  useEffect(() => {
      setTimeout(() => { if (alertMessage) { setAlertMessage() }} , 4000)
  }, [alertMessage])

  const setToken = (userToken) => {
    sessionStorage.setItem('dfsTrackerToken', JSON.stringify(userToken))
  } 

  const setUserId = (userId) => {
    sessionStorage.setItem('dfsTrackerUserId', JSON.stringify(userId))
  }

  const closeAlertMessage = () => {
    setAlertMessage(null)
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
                      <LineupsPage />
                    </div>
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
                        <LineupsPage />
                      </div>
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
                        <SingleLineupPage  />
                      </div>
                    </div>
                  : 
                    <LoginPage setToken={setToken} />
                  }
                </>
              } />
            </Route>

            <Route path="upcoming" element={
              <>
                <ScrollToTop />
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <UpcomingPage week={18} year={2021} />
                    </div>
                  </div>
                :
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="createLineup/:draftGroupId/:lineupId" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} />
                    <div className="page-wrapper-inner"> 
                      <CreateLineupPage setAlertMessage={setAlertMessage}/>
                    </div>
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="compareLineups/:draftGroupId" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} />
                    <div className="page-wrapper-inner"> 
                      <CompareLineupsPage setAlertMessage={setAlertMessage}/>
                    </div>
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
                      <ResearchPage />
                    </div>
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="history" element={
              <>
                <ScrollToTop/>
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <HistoryPage />
                    </div>
                  </div>
              </>
            } />

            <Route path="player/:name" element={
              <>
                <ScrollToTop />
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar />
                    <div className="page-wrapper-inner"> 
                      <PlayerPage />
                    </div>
                  </div>
                : 
                  <LoginPage setToken={setToken} />
                }
              </>
            } />

            <Route path="feedback" element={
              <>
                <ScrollToTop />
                <div className='page-wrapper'>
                  <Navbar />
                  <div className='page-wrapper-inner'>
                    <FeedbackPage />
                  </div>
                </div>
              </>
            } />

            <Route path="profile" element={
              <>
                <ScrollToTop />
                <div className='page-wrapper'>
                  <Navbar />
                  <div className='page-wrapper-inner'>
                    <ProfilePage />
                  </div>
                </div>
              </>
            } />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

