import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PlayerLink from '../../Buttons/PlayerLink/PlayerLink'
import './PlayersTable.scss'
import { FaSearch } from 'react-icons/fa'

const PlayersTable = ({ players, weekSearch, selectedWeek, selectedYear }) => {

  const [posFilter, setPosFilter] = useState("All")
  const [currPage, setCurrPage] = useState(0)

  const truncPoints = (player) => {
    if (player.position == 'DST') {
      return player.stats.fanduel_points
    }
    return Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  }

  const changeFilter = (pos) => {
    setPosFilter(pos)
    setCurrPage(0)
  }

  return (
    <div className="players-results">
      <div className="pos-filter-wrapper">
        <div className='pos-filter-wrapper-inner'>
          <button 
            className={`filter-btn${posFilter === "All" ? "-active" : ""}`} 
            onClick={() => changeFilter("All")}>All
          </button>
          <button 
            className={`filter-btn${posFilter === "QB" ? "-active" : ""}`} 
            onClick={() => changeFilter("QB")}>QB
          </button>
          <button 
            className={`filter-btn${posFilter === "RB" ? "-active" : ""}`} 
            onClick={() => changeFilter("RB")}>RB
          </button>
          <button 
            className={`filter-btn${posFilter === "WR" ? "-active" : ""}`} 
            onClick={() => changeFilter("WR")}>WR
          </button>
          <button 
            className={`filter-btn${posFilter === "TE" ? "-active" : ""}`} 
            onClick={() => changeFilter("TE")}>TE
          </button>
          <button
            className={`filter-btn${posFilter === "DST" ? "-active" : ""}`} 
            onClick={() => changeFilter("DST")}>DST
          </button>
        </div>
        <div className="player-search">
            <div>
              <input type="text" placeholder="Search Player" className="search-input"></input>
            </div>
            <button className="search-btn" type="button" onClick={() => weekSearch(selectedWeek, selectedYear)}><FaSearch /></button>
          </div>
      </div>
      <table className="lineups-table">
        {posFilter !== "DST" ? 
        <>
          <thead>
            <tr className="col-labels">
              <th colspan="4"></th>
              <th className="col-label" colspan="3">Passing</th>
              <th className="col-label" colspan="2">Rushing</th>
              <th className="col-label" colspan="3">Recieving</th>
              <th className="col-label" colspan="2">Misc.</th>
            </tr>
            <tr className="table-header">
              <th>Rank</th>
              <th>Name</th>
              <th>Pos</th>
              <th>FAN Pts</th>
              <th>YRDs</th>
              <th>TDs</th>
              <th>INTs</th>
              <th>YRDs</th>
              <th>TDs</th>
              <th>RECs</th>
              <th>YRDs</th>
              <th>TDs</th>
              <th>FUM Lost</th>
              <th>2PTs</th>
            </tr>
          </thead>
          <tbody>
          { players[posFilter].slice(0, 50 + (currPage * 50)).map((player) => 
            <tr>
              <td>{player.rank}</td>
              <td><strong><PlayerLink playerName={player.name} /></strong></td>
              <td>{player.position}</td>
              <td className="points-col"><strong>{truncPoints(player)}</strong></td>
              <td>{player.stats.passing_yards}</td>
              <td>{player.stats.passing_touchdowns}</td>
              <td>{player.stats.passing_interceptions}</td>
              <td>{player.stats.rushing_yards}</td>
              <td>{player.stats.rushing_touchdowns}</td>
              <td>{player.stats.receptions}</td>
              <td>{player.stats.recieving_yards}</td>
              <td>{player.stats.recieving_touchdowns}</td>
              <td>{player.stats.fumbles_lost}</td>
              <td>{player.stats.passing_2point_conversions + player.stats.rushing_2point_conversions + player.stats.recieving_2point_conversions}</td>
            </tr>
          )}
          </tbody>
        </>
      :
        <>
          <thead>
            <tr className="table-header">
              <th>Rank</th>
              <th>Name</th>
              <th>Pos</th>
              <th>FAN Pts</th>
              <th>TDs</th>
              <th>INTs</th>
              <th>BLKs</th>
              <th>SFTs</th>
              <th>FR</th>
              <th>YRDs Allowed</th>
              <th>PTs Allowed</th>
            </tr>
          </thead>
          <tbody>
          { players[posFilter].slice(0, 50 + (currPage * 50)).map((player) => 
            <tr>
              <td>{player.rank}</td>
              <td><strong><Link className="player-link" to={`/team/${player.team}`}>{player.city} {player.name}</Link></strong></td>
              <td>{player.position}</td>
              <td className="points-col"><strong>{truncPoints(player)}</strong></td>
              <td>{player.stats.touchdowns}</td>
              <td>{player.stats.interceptions}</td>
              <td>{player.stats.blocks}</td>
              <td>{player.stats.safeties}</td>
              <td>{player.stats.fumble_recoveries}</td>
              <td>{player.stats.passing_yards_against + player.stats.rushing_yards_against}</td>
              <td>{player.stats.points_against}</td>
            </tr>
          )}
          </tbody>
        </>
      }
      </table>
      { players[posFilter].length > (currPage + 1) * 50 &&
        <div>
          <button className="load-more-btn" onClick={() => setCurrPage(currPage + 1)}>Show More</button>
        </div>
      }
    </div>
  )
}

export default PlayersTable