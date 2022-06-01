import { useState, useEffect } from 'react'
import './ResearchHeader.scss'

const ResearchHeader = ({ props, changeTab, activeTab, setSelectedWeek, selectedWeek, 
		setSelectedYear, selectedYear, setGames, setPlayers, setPlayerSearchData, 
		selectedTeam, setSelectedTeam, teamSearch }) => {

  const years = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]
  const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

  const [nameSearch, setNameSearch] = useState("")
  const [teams, setTeams] = useState([])

  useEffect(() => {
  	getTeams()
  }, [])

  const weekSearch = async (week, year) => {
    const res = await fetch(`/research/search?week=${week}&year=${year}`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      },
    })
    const result = await res.json()
    setPlayers(result["players"])
    var games_data = []
    result["games"].map((game) => {
      const games_split = game.split("@")
      games_data.push(
      {
        "game": game,
        "away": games_split[0],
        "home": games_split[1]
      })
    })
    setGames(games_data)
  }

  const playerSearch = async (name) => {
    const res = await fetch(`/research/player?name=${name}`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      }
    })
    if (res.status === 200) {
    	setPlayerSearchData(await res.json())
    } else {
    	setPlayerSearchData({"error": "No Player Found"})
    }
  }

  const getTeams = async () => {
  	const res = await fetch(`/nfl/teams`, {
  		method: "GET",
  		headers: {
  			"x-access-token": sessionStorage.dfsTrackerToken
  		}
  	})
  	setTeams(await res.json())
  }

  const changeYear = (year) => {
    setSelectedWeek("1")
    setSelectedYear(year)
  }

  return (
    <div className="research-header">
      <div className="filter-btn-wrapper">
        <button className={`filter-btn${activeTab === "week" ? "-active": ""}`} onClick={() => changeTab("week")}>Week</button>
        <button className={`filter-btn${activeTab === "player" ? "-active": ""}`} onClick={() => changeTab("player")}>Player</button>
        <button className={`filter-btn${activeTab === "team" ? "-active": ""}`} onClick={() =>  changeTab("team")}>Team</button>
      </div>
      {activeTab === "week" &&
        <div className="week-search">
          <div className="week-search-inner">
          	<div>
	            <label>Year:</label>
	            <select 
	              className="year-select" 
	              value={selectedYear} 
	              onChange={(e) => changeYear(e.target.value) }>
	            {years.map((year) => 
	              <option value={year} key={year}>{year}</option>
	            )}
	            </select>
	          </div>
	          <div>
	            <label>Week:</label>
	            <select 
	              className="week-select" 
	              value={selectedWeek}
	              onChange={(e) => setSelectedWeek(e.target.value)}>
	            {weeks.map((week) =>
	              !(week > 17 && selectedYear < 2021) &&
	                <option value={week} key={week}>{week}</option>
	            )}
	            </select>
	          </div>
	          <div>
	            <button type="button" className="search-btn" onClick={() => weekSearch(selectedWeek, selectedYear)}>Search</button>
	          </div>
	        </div>
        </div>
      }
      { activeTab === "player" &&
        <div className="week-search">
          <div className="week-search-inner">
          	<div>
	            <label>Name:</label>
	            <input 
	              type="text" 
	              placeholder="Enter Name" 
	              value={nameSearch}
	              onChange={(e) => setNameSearch(e.target.value)} />
	          </div>
	          <div>
	            <button type="button" className="search-btn" onClick={() => playerSearch(nameSearch)}>Search</button>
	          </div>
	        </div>
        </div>
      }
      { activeTab === "team" &&
        <div className="week-search">
          <div className="week-search-inner">
          	<div>
	          	<label>Team:</label>
	            <select 
	              className="week-select" 
	              value={selectedTeam}
	              onChange={(e) => setSelectedTeam(e.target.value)}>
	            	{teams.length > 0 && teams.map((team) =>
	                <option value={team} key={team}>{team}</option>
	            	)}
	            </select>
	            </div>
	          <div>  
	          	<button type="button" className="search-btn" onClick={() => teamSearch(selectedTeam)}>Search</button>
	          </div>
	        </div>
        </div>
      }

    </div>
  )
}

export default ResearchHeader