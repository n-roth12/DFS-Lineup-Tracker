import './ResearchPage.scss'
import { useState, useEffect, useRef } from 'react'
import PlayerDialog from '../SingleLineupPage/PlayerDialog/PlayerDialog'
import PlayersTable from './PlayersTable/PlayersTable'
import GamesSlider from './GamesSlider/GamesSlider'

const ResearchPage = () => {

  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("18")
  const [playerData, setPlayerData] = useState([])
  const [gamesData, setGamesData] = useState([])
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [dialogPlayer, setDialogPlayer] = useState({})
  const [playerSearchData, setPlayerSearchData] = useState({})
  const [nameSearch, setNameSearch] = useState("")
  const [activeTab, setActiveTab] = useState("week")

  const listRefAll = useRef()
  const listRefQB = useRef()
  const listRefRB = useRef()
  const listRefWR = useRef()
  const listRefTE = useRef()
  const listRefDST = useRef()


  const weekSearch = async (week, year) => {
    const res = await fetch(`/research/search?week=${week}&year=${year}`, {
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

  const playerSearch = async (name) => {
    const res = await fetch(`/research/player?name=${name}`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      }
    })
    setPlayerSearchData(await res.json())
  }

  const changeYear = (year) => {
    setSelectedWeek("1")
    setSelectedYear(year)
  }

  const openPlayerDialog = (player) => {
    setDialogPlayer(player)
    setShowPlayerDialog(true)
  }

  const truncPoints = (player) => {
    if (player.position == 'DST') {
      return player.stats.fanduel_points
    }
    return Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  }

  return (
    <div className="research-page">
      <div className="header">
        <div className="tabs">
          <ul>
            <li className={activeTab === "week" && "active"} onClick={() => setActiveTab("week")}>Week</li>
            <li className={activeTab === "player" && "active"} onClick={() => setActiveTab("player")}>Player</li>
            <li className={activeTab === "team" && "active"} onClick={() =>  setActiveTab("team")}>Team</li>
          </ul>
        </div>
        {activeTab === "week" &&
          <div className="week-search">
            <h2>Research a Week</h2>
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
              <button type="button" onClick={() => weekSearch(selectedWeek, selectedYear)}>Search</button>
            </div>
          </div>
        }
        { activeTab === "player" &&
          <div className="week-search">
            <h2>Search a Player</h2>
            <div>
              <label>Enter a Player:</label>
              <input 
                type="text" 
                placeholder="Enter Name" 
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)} />
            </div>
            <div>
              <button type="button" onClick={() => playerSearch(nameSearch)}>Search</button>
            </div>
          </div>
        }
        { activeTab === "team" &&
          <div className="week-search">
            <h2>Pick a Team:</h2>
          </div>
        }

      </div>
      {playerData.length > 0 && activeTab === "week" &&
      <div className="search-results">
        <GamesSlider games={gamesData} selectedWeek={selectedWeek} selectedYear={selectedYear} />
        <PlayersTable players={playerData} />
      </div>
    }
    { activeTab === "player" &&
      <div className="player-search-results">
        { playerSearchData && playerSearchData.career &&
          <h2>{playerSearchData.career.name} | {playerSearchData.career.position}</h2> 
        }
        { playerSearchData && playerSearchData.last_year && 
          <div className="last-year-stats">
            <h2>2021</h2>
            <table className="lineups-table">
            { (playerSearchData.last_year.position === "RB" ||
              playerSearchData.last_year.position === "WR" ||
              playerSearchData.last_year.position === "TE" ) && 
              <>
                <tr>
                  <th>Rush Yrds</th>
                  <th>Rush TDs</th>
                  <th>Recs</th>
                  <th>Rec Yrds</th>
                  <th>Rec TDs</th>
                  <th>Fum Lost</th>
                  <th>Fan Pts</th>
                </tr>
                <tr>
                  <td>{playerSearchData.last_year.stats.rushing_yards}</td>
                  <td>{playerSearchData.last_year.stats.rushing_touchdowns}</td>
                  <td>{playerSearchData.last_year.stats.receptions}</td>
                  <td>{playerSearchData.last_year.stats.recieving_yards}</td>
                  <td>{playerSearchData.last_year.stats.recieving_touchdowns}</td>
                  <td>{playerSearchData.last_year.stats.fumbles_lost}</td>
                  <td>{playerSearchData.last_year.stats.fantasy_points}</td>
                </tr>
              </>
            }
            {
              playerSearchData.last_year.position === "QB" &&
              <>
                <tr>
                  <th>Pass Yrds</th>
                  <th>Pass TDs</th>
                  <th>Rush Yrds</th>
                  <th>Rush Tds</th>
                  <th>INTs</th>
                  <th>Fum Lost</th>
                </tr>
                <tr>
                  <td>{playerSearchData.last_year.stats.passing_yards}</td>
                  <td>{playerSearchData.last_year.stats.passing_touchdowns}</td>
                  <td>{playerSearchData.last_year.stats.rushing_yards}</td>
                  <td>{playerSearchData.last_year.stats.rushing_touchdowns}</td>
                  <td>{playerSearchData.last_year.stats.passing_interceptions}</td>
                  <td>{playerSearchData.last_year.stats.fumbles_lost}</td>
                </tr>
              </>
            }
            </table>
          </div>
        }
        { playerSearchData && playerSearchData.career &&
          <div className="career-stats">
            <h2>Career</h2>
            <table className="lineups-table">
            { (playerSearchData.career.position === "RB" ||
              playerSearchData.career.position === "WR" ||
              playerSearchData.career.position === "TE") &&
            <>
              <tr>
                <th>Rush Yrds</th>
                <th>Rush TDs</th>
                <th>Recs</th>
                <th>Rec Yrds</th>
                <th>Rec TDs</th>
                <th>Fum Lost</th>
                <th>Fan Pts</th>
              </tr>
              <tr>
                <td>{playerSearchData.career.stats.rushing_yards}</td>
                <td>{playerSearchData.career.stats.rushing_touchdowns}</td>
                <td>{playerSearchData.career.stats.receptions}</td>
                <td>{playerSearchData.career.stats.recieving_yards}</td>
                <td>{playerSearchData.career.stats.recieving_touchdowns}</td>
                <td>{playerSearchData.career.stats.fumbles_lost}</td>
                <td>{playerSearchData.career.stats.fantasy_points}</td>
              </tr>
            </>
            }
            {
              playerSearchData.last_year.position === "QB" &&
              <>
                <tr>
                  <th>Pass Yrds</th>
                  <th>Pass TDs</th>
                  <th>Rush Yrds</th>
                  <th>Rush Tds</th>
                  <th>INTs</th>
                  <th>Fum Lost</th>
                </tr>
                <tr>
                  <td>{playerSearchData.career.stats.passing_yards}</td>
                  <td>{playerSearchData.career.stats.passing_touchdowns}</td>
                  <td>{playerSearchData.career.stats.rushing_yards}</td>
                  <td>{playerSearchData.career.stats.rushing_touchdowns}</td>
                  <td>{playerSearchData.career.stats.passing_interceptions}</td>
                  <td>{playerSearchData.career.stats.fumbles_lost}</td>
                </tr>
              </>
            }
            </table>
          </div>
        }
      </div>
    }

    </div>
  )
}

export default ResearchPage