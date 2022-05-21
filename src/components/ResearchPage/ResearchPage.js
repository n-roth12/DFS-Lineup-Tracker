import './ResearchPage.css'
import { useState, useEffect, useRef } from 'react'

const ResearchPage = () => {

  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("18")
  const [playerData, setPlayerData] = useState({})
  const [gamesData, setGamesData] = useState([])

  const listRef = useRef()

  const search = (week, year) => {
    getPlayers(week, year)
    getGames(week, year)
  }

  const getPlayers = async (week, year) => {
    const res = await fetch(`/research/search?week=${week}&year=${year}`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      },
    })
    setPlayerData(await res.json())
  }

  const getGames = async (week, year) => {
    const res = await fetch(`/upcoming/games?week=${week}&year=${year}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    setGamesData(await res.json())
  }

  const changeYear = (year) => {
    setSelectedWeek("1")
    setSelectedYear(year)
  }

  const handleClick = (direction) => {
    var distance = listRef.current.getBoundingClientRect().x
    if (direction === 'left') {
      console.log(distance)
      listRef.current.style.transform = `translateX(${250 + distance}px)`
    } else {
      console.log(distance)
      listRef.current.style.transform = `translateX(${-250 - distance}px)`
    }
  }

  return (

    <div className="research-page">
      <div className="header">
        <h1>Select a Week to Research</h1>

        <div className="selects">
          <div>
            <label for="years">Select Year:</label>
            <select 
              className="year-select" 
              value={selectedYear} 
              onChange={(e) => changeYear(e.target.value) }>
            {years.map((year) => 
              <option value={year}>{year}</option>
            )}
            </select>
          </div>

          <div>
            <label for="weeks">Select Week:</label>
            <select 
              className="week-select" 
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}>
            {weeks.map((week) =>
              !(week > 17 && selectedYear < 2021) &&
                <option value={week}>{week}</option>
              
            )}
            </select>
          </div>

          <div>
            <button type="button" onClick={() => search(selectedWeek, selectedYear)}>Search</button>
          </div>
        </div>
      </div>
      {playerData.length > 0 &&
      <div className="search-results">
        <div className="players-results">
          <h1>Players:</h1>
          <div className="players-row-wrapper">
            <h2>All</h2>
            <div className="players-row">
              <>
              {playerData.map((player) => 
                <div className="research-card">
                  <h3 className="pos-label">OVR{player.rank}</h3>
                  <h3>{player.name}</h3>
                </div>
              )}
              </>
            </div>
          </div>
          <div className="players-row-wrapper">
            <h2>QB</h2>
            <div className="players-row">
              <>
              {playerData.map((player) => 
                player.position === "QB" &&
                  <div className="research-card">
                    <h3 className="pos-label">QB{player.rank}</h3>
                    <h3>{player.name}</h3>
                  </div>
              )}
              </>
            </div>
          </div>
          <div className="players-row-wrapper">
            <h2>RB</h2>
            <div className="players-row">
              <>
              {playerData.map((player) => 
                player.position === "RB" &&
                  <div className="research-card">
                    <h3 className="pos-label">RB{player.rank}</h3>
                    <h3>{player.name}</h3>
                  </div>
              )}
              </>
            </div>
          </div>
          <div className="players-row-wrapper">
            <h2>WR</h2>
            <div className="players-row">
              <>
              {playerData.map((player) => 
                player.position === "WR" &&
                  <div className="research-card">
                    <h3 className="pos-label">WR{player.rank}</h3>
                    <h3>{player.name}</h3>
                  </div>  
              )}
              </>
            </div>
          </div>
          <h2>TE</h2>
          <div className="players-row-wrapper">
            <button className="left-paddle paddle" onClick={() => handleClick("left")} ></button>
            <div className="players-row" ref={listRef}>
              <>
              {playerData.map((player) => 
                player.position === "TE" &&
                  <div className="research-card">
                    <h3 className="pos-label">TE{player.rank}</h3>
                    <h3>{player.name}</h3>
                  </div>
              )}
              </>
            </div>
              <button className="right-paddle paddle" onClick={() => handleClick("right")}></button>
          </div>
          <div className="players-row-wrapper">
            <h2>DST</h2>
            <div className="players-row">
              <>
              {playerData.map((player) => 
                player.position === "DST" &&
                  <div className="research-card">
                    <h3 className="pos-label">DST{player.rank}</h3>
                    <h3>{player.name}</h3>
                  </div>
              )}
              </>
            </div>
          </div>
        </div>

        {gamesData.length > 0 &&
        <div className="games-results">
          <h1>Games:</h1>
          <div className="upcoming-games"> 
            <ul className="games-list">
            {gamesData.map((game) => 
              <li>{game}</li>
            )}
            </ul>
          </div>
        </div>
        }

      </div>
    }

    </div>
  )
}

export default ResearchPage