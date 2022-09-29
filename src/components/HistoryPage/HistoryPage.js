import './HistoryPage.scss'
import { useState, useEffect, useRef } from 'react'
import PlayerDialog from '../SingleLineupPage/PlayerDialog/PlayerDialog'
import PlayersTable from './PlayersTable/PlayersTable'
import GamesSlider from './GamesSlider/GamesSlider'
import PlayerSearch from './PlayerSearch/PlayerSearch'
import { Roller } from 'react-awesome-spinners'

const ResearchPage = () => {

  const years = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]
  const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

  const [playerData, setPlayerData] = useState([])
  const [gamesData, setGamesData] = useState([])
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [playerSearchData, setPlayerSearchData] = useState({})
  const [activeTab, setActiveTab] = useState("week")
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("All")
  const [selectedTeam, setSelectedTeam] = useState({})
  const [nameSearch, setNameSearch] = useState("")
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [topSearches, setTopSearches] = useState([])

  useEffect(() => {
    weekSearch(selectedWeek, selectedYear)
    getTopSearches()
  }, [])

  const getTopSearches = async () => {
    const res = await fetch(`/history/search/top_searches`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      },
    })
    const result = await res.json()
    setTopSearches(result["names"])
  }

  const weekSearch = async (week, year) => {
    setLoading(true)
    if (week === "All") {
      const res = await fetch(`/history/search/year?week=${week}&year=${year}`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        },
      })
      const result = await res.json()
      setPlayerData(result["players"])
    } else {
      const res = await fetch(`/history/search/week?week=${week}&year=${year}`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        },
      })
      const result = await res.json()
      setPlayerData(result["players"])
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
      setGamesData(games_data)
    }
    setLoading(false)
  }

  const playerSearch = async (name) => {
    setLoading(true)
    const res = await fetch(`/history/player?name=${name}`, {
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
    setLoading(false)
  }

  const teamSearch = (team) => {
    console.log(team)
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
    <div className="history-page page">
      <div className="research-header">
        <div className="filter-btn-wrapper">
          <button className={`filter-btn${activeTab === "week" ? "-active": ""}`} onClick={() => setActiveTab("week")}>Week</button>
          <button className={`filter-btn${activeTab === "player" ? "-active": ""}`} onClick={() => setActiveTab("player")}>Player</button>
          <button className={`filter-btn${activeTab === "team" ? "-active": ""}`} onClick={() =>  setActiveTab("team")}>Team</button>
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
                  <option value={"All"} key={"All"}>All</option>
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

      {loading ? 
        <h1>Loading...</h1>
      :
      <>
        {activeTab === "week" && playerData["All"] &&
          <div className="search-results">
            {gamesData.length > 0 &&
              <GamesSlider 
                games={gamesData} 
                selectedWeek={selectedWeek} 
                selectedYear={selectedYear} />
            }
            <PlayersTable players={playerData} />
          </div>
        }
        { activeTab === "player" && 
          <>
            {Object.keys(playerSearchData).length !== 0 ?
              <PlayerSearch playerSearchData={playerSearchData} />
            :
            <>
              {topSearches.length > 0 &&
                <div className="popular-players">
                  <h2>Popular Searches:</h2>
                  <ul>
                    {topSearches.map((player) => 
                      <li className="player-link"
                        onClick={() => playerSearch(player)}>{player}</li>
                    )}
                  </ul>
                </div>
              }
            </>
            }
          </>
        }
      </>
      } 

    </div>
  )
}

export default ResearchPage