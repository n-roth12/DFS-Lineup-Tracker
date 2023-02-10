import './HistoryPage.scss'
import { useState, useEffect, useRef } from 'react'
import PlayersTable from '../../TablesLists/PlayersTable/PlayersTable'
import { FaSearch } from 'react-icons/fa'
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

  useEffect(() => {
    weekSearch(selectedWeek, selectedYear)
  }, [selectedWeek, selectedYear])

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
    setSelectedWeek("All")
    setSelectedYear(year)
  }

  return (
    <div className="history-page page">
      <div className="header">
        <div className="header-label-wrapper">
          <p className="header-label">Historical Stats</p>
        </div>
        <div className="header-inner">
          <div className="selectors">
            <select 
              className="year-select" 
              value={selectedYear} 
              onChange={(e) => changeYear(e.target.value) }>
              {years.map((year) => 
                <option value={year} key={year}>{year}</option>
              )}
            </select>
            <select 
              className="week-select" 
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}>
              {weeks.map((week) =>
                !(week > 17 && selectedYear < 2021) &&
                  <option value={week} key={week}>Week {week}</option>
              )}
              <option value={"All"} key={"All"}>Season</option>
            </select>
          </div>
          <div className="player-search">
            <div>
              <input type="text" placeholder="Search Player" className="search-input"></input>
            </div>
            <button className="search-btn" type="button" onClick={() => weekSearch(selectedWeek, selectedYear)}><FaSearch /></button>
          </div>
        </div>
      </div>

      {loading ? 
        <div className='loading-screen'>
          <h3><Roller /></h3>
        </div>
      :
      <>
        {playerData["All"] &&
          <div className="search-results">
            <PlayersTable players={playerData} />
          </div>
        }
      </>
      } 

    </div>
  )
}

export default ResearchPage