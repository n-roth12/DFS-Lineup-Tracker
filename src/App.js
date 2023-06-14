import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LineupsPage from './components/Pages/LineupsPage/LineupsPage'
import LoginPage from './components/Pages/LoginPage/LoginPage'
import RegisterPage from './components/Pages/RegisterPage/RegisterPage'
import UpcomingPage from './components/Pages/UpcomingPage/UpcomingPage'
import HistoryPage from './components/Pages/HistoryPage/HistoryPage'
import ResearchPage from './components/Pages/ResearchPage/ResearchPage'
import CreateLineupPage from './components/Pages/CreateLineupPage/CreateLineupPage'
import PlayerPage from './components/Pages/PlayerPage/PlayerPage'
import CompareLineupsPage from './components/Pages/CompareLineupsPage/CompareLineupsPage'
import ProfilePage from './components/Pages/ProfilePage/ProfilePage'
import ContactPage from './components/Pages/ContactPage/ContactPage'
import Navbar from './components/Navbar/Navbar'
import './App.css'
import { ScrollToTop } from './ScrollToTop'
import Footer from './components/Footer/Footer'
import NotFound from './components/Pages/NotFound/NotFound';
function App() {

  const [alertMessage, setAlertMessage] = useState()
  const [alertColor, setAlertColor] = useState()
  const [alertTime, setAlertTime] = useState(4000)

  useEffect(() => {
    document.title = "Mainslater"
  })

  useEffect(() => {
    setTimeout(() => { if (alertMessage) { setAlertMessage() && setAlertTime(4000) } }, alertTime)
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
                  <Navigate to={`/lineups`} />
                  :
                  <Navigate to={`/login`} />
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
                  <ScrollToTop />
                  <div className="page-wrapper">
                    <Navbar alertMessage={alertMessage} alertColor={alertColor} closeAlertMessage={closeAlertMessage} />
                    <div className="page-wrapper-inner">
                      <LineupsPage setAlertMessage={setAlertMessage} setAlertColor={setAlertColor} setAlertTime={setAlertTime} />
                    </div>
                    <Footer />
                  </div>
                </>
              } />
            </Route>

            <Route path="upcoming" element={
              <>
                <ScrollToTop />
                <div className="page-wrapper">
                  <Navbar alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
                  <div className="page-wrapper-inner">
                    <UpcomingPage week={18} year={2021} setAlertMessage={setAlertMessage} setAlertColor={setAlertColor}
                      setAlertTime={setAlertTime} />
                  </div>
                </div>
              </>
            } />

            <Route path="createLineup/:draftGroupId/:lineupId" element={
              <>
                <div className="page-wrapper">
                  <Navbar alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
                  <div className="page-wrapper-inner">
                    <CreateLineupPage setAlertMessage={setAlertMessage} setAlertColor={setAlertColor}
                      setAlertTime={setAlertTime} />
                  </div>
                </div>
              </>
            } />

            <Route path="compareLineups/:draftGroupId" element={
              <>
                {sessionStorage.dfsTrackerToken ?
                  <div className="page-wrapper">
                    <Navbar alertMessage={alertMessage} closeAlertMessage={closeAlertMessage} alertColor={alertColor} />
                    <div className="page-wrapper-inner">
                      <CompareLineupsPage setAlertMessage={setAlertMessage} setAlertColor={setAlertColor}
                        setAlertTime={setAlertTime} />
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
                <ScrollToTop />
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

            <Route path="contact" element={
              <>
                <ScrollToTop />
                <div className='page-wrapper'>
                  <Navbar />
                  <div className='page-wrapper-inner'>
                    <ContactPage />
                  </div>
                </div>
              </>
            } />

          </Route>

          <Route path="*" element={
            <>
              <ScrollToTop />
              <div className='page-wrapper'>
                <Navbar alertMessage={alertMessage} alertColor={alertColor} closeAlertMessage={closeAlertMessage} />
                <div className='page-wrapper-inner'>
                  <NotFound />
                </div>
                <Footer />
              </div>
            </>
          } />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

