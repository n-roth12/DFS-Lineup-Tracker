import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PlayersTable.scss'

const PlayersTable = ({ players }) => {

  const [posFilter, setPosFilter] = useState("")

  const truncPoints = (player) => {
    if (player.position == 'DST') {
      return player.stats.fanduel_points
    }
    return Math.round((player.stats.fantasy_points + Number.EPSILON) * 100) / 100
  }

  return (
    <div className="players-results">
      <h1>Players:</h1>
      <div className="filter-btn-wrapper">
        <button 
          className={`filter-btn${posFilter === "" ? "-active" : ""}`} 
          onClick={() => setPosFilter("")}>All
        </button>
        <button 
          className={`filter-btn${posFilter === "QB" ? "-active" : ""}`} 
          onClick={() => setPosFilter("QB")}>QB
        </button>
        <button 
          className={`filter-btn${posFilter === "RB" ? "-active" : ""}`} 
          onClick={() => setPosFilter("RB")}>RB
        </button>
        <button 
          className={`filter-btn${posFilter === "WR" ? "-active" : ""}`} 
          onClick={() => setPosFilter("WR")}>WR
        </button>
        <button 
          className={`filter-btn${posFilter === "TE" ? "-active" : ""}`} 
          onClick={() => setPosFilter("TE")}>TE
        </button>
      </div>
      <table className="lineups-table">
        <thead>
          <tr className="col-labels">
            <th colspan="5"></th>
            <th className="col-label" colspan="3">Passing</th>
            <th className="col-label" colspan="2">Rushing</th>
            <th className="col-label" colspan="3">Recieving</th>
            <th className="col-label" colspan="1">Misc.</th>
          </tr>
          <tr className="table-header">
            <th>Rank</th>
            <th>Name</th>
            <th>Pos</th>
            <th>Team</th>
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
          </tr>
        </thead>
        <tbody>
        {players.map((player) => 
          ((posFilter === "" && player.position !== "DST")
          || (player.position === posFilter)) &&
          <tr>
            <td>{player.rank}</td>
            <td><strong><Link className="player-link" to={`/research`}>{player.name}</Link></strong></td>
            <td>{player.position}</td>
            <td>{player.stats.team}</td>
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
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default PlayersTable