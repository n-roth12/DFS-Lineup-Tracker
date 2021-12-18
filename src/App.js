import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Players from './components/Players'
import Lineup from './components/Lineup'
import LineupsPage from './components/LineupsPage'
import SingleLineupPage from './components/SingleLineupPage'
import './App.css';
import { FaAngleLeft } from 'react-icons/fa'

function App() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
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
