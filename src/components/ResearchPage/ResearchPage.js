import './ResearchPage.scss'
import { useState, useEffect, useRef } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import PlayerDialog from '../SingleLineupPage/PlayerDialog/PlayerDialog'
import { Link } from 'react-router-dom'

const ResearchPage = () => {

  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("18")
  const [playerData, setPlayerData] = useState({})
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
    setGamesData(result["games"])
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

  const handleClick = (direction, ref) => {
    const left_pos = ref.current.getBoundingClientRect().x - 270
    if (direction === "left" && left_pos < 0) {
      ref.current.style.transform = `translateX(${left_pos + 400}px)`
    } else if (direction === "right") {
      ref.current.style.transform = `translateX(${left_pos - 400}px)`
    }
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

  const alterGame = (game) => {
    return game.replace("@", "-")
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
        <div className="players-results">
          <h1>Players:</h1>
          <div className="players-row-outer">
            <h2 className="players-row-label">All</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle" 
                onClick={() => handleClick("left", listRefAll)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefAll}>
                <>
                {playerData.map((player) => 
                  <div className="research-card">
                    <h3 className="pos-label">OVR{player.rank}</h3>
                    <h3 className="player-name" onClick={(() => openPlayerDialog(player))}>{player.name}</h3>
                    <h3>{truncPoints(player)} Pts</h3>
                  </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefAll)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <div className="players-row-outer">
            <h2 className="players-row-label">QB</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle hidden" 
                onClick={() => handleClick("left", listRefQB)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefQB}>
                <>
                {playerData.map((player) => 
                  player.position === "TE" &&
                    <div className="research-card">
                      <h3 className="pos-label">QB{player.rank}</h3>
                      <h3 className="player-name" onClick={() => openPlayerDialog(player)}>{player.name}</h3>
                      <h3>{truncPoints(player)} Pts</h3>
                    </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefQB)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <div className="players-row-outer">
            <h2 className="players-row-label">RB</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle hidden" 
                onClick={() => handleClick("left", listRefRB)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefRB}>
                <>
                {playerData.map((player) => 
                  player.position === "RB" &&
                    <div className="research-card">
                      <h3 className="pos-label">RB{player.rank}</h3>
                      <h3 className="player-name" onClick={() => openPlayerDialog(player)}>{player.name}</h3>
                      <h3>{truncPoints(player)} Pts</h3>
                    </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefRB)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <div className="players-row-outer">
            <h2 className="players-row-label">WR</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle hidden" 
                onClick={() => handleClick("left", listRefWR)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefWR}>
                <>
                {playerData.map((player) => 
                  player.position === "WR" &&
                    <div className="research-card">
                      <h3 className="pos-label">WR{player.rank}</h3>
                      <h3 className="player-name" onClick={() => openPlayerDialog(player)}>{player.name}</h3>
                      <h3>{truncPoints(player)} Pts</h3>
                    </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefWR)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <div className="players-row-outer">
            <h2 className="players-row-label">TE</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle hidden" 
                onClick={() => handleClick("left", listRefTE)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefTE}>
                <>
                {playerData.map((player) => 
                  player.position === "TE" &&
                    <div className="research-card">
                      <h3 className="pos-label">TE{player.rank}</h3>
                      <h3 className="player-name" onClick={() => openPlayerDialog(player)}>{player.name}</h3>
                      <h3>{truncPoints(player)} Pts</h3>
                    </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefTE)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <div className="players-row-outer">
            <h2 className="players-row-label">DST</h2>
            <div className="players-row-wrapper">
              <button 
                className="left-paddle paddle hidden" 
                onClick={() => handleClick("left", listRefDST)} >
                  <FaAngleLeft className="slider-icon" />
              </button>
              <div className="players-row" ref={listRefDST}>
                <>
                {playerData.map((player) => 
                  player.position === "DST" &&
                    <div className="research-card">
                      <h3 className="pos-label">DST{player.rank}</h3>
                      <h3 className="player-name" onClick={() => openPlayerDialog(player)}>{player.name}</h3>
                      <h3>{truncPoints(player)} Pts</h3>
                    </div>
                )}
                </>
              </div>
                <button 
                  className="right-paddle paddle" 
                  onClick={() => handleClick("right", listRefDST)}>
                    <FaAngleRight className="slider-icon" />
                </button>
            </div>
          </div>
          <PlayerDialog 
            showPlayerDialog={showPlayerDialog} 
            onClose={() => setShowPlayerDialog(false)} 
            dialogPlayer={dialogPlayer}/>
        </div>

        {gamesData.length > 0 &&
        <div className="games-results">
          <h1>Games:</h1>
          <div className="upcoming-games"> 
            <ul className="games-list">
            {gamesData.map((game) =>
              <li>
                <Link className="game-link" to={`/research/${alterGame(game)}/${selectedWeek}/${selectedYear}`}>{game}</Link>
              </li>
            )}
            </ul>
          </div>
        </div>
        }
      }
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