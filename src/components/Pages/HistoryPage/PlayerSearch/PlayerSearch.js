import './PlayerSearch.scss'
import { useState, useEffect } from 'react'

const PlayerSearch = ({ playerSearchData }) => {

  const [lastSeason, setLastSeason] = useState({})

  useEffect(() => {
    getLastSeason()
  }, [playerSearchData])

  const getLastSeason = async () => {
    if (playerSearchData.name) {
      const res = await fetch(`/history/player?name=${playerSearchData.name}&year=2021`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        }
      })
      setLastSeason(await res.json())
    } else {
      setLastSeason({})
    }
  }

  return (
    <div className="player-search-results">
      {playerSearchData.error &&
        <h1>{playerSearchData.error}</h1>
      }
      { playerSearchData.name &&
        <h1>{playerSearchData.name} | {playerSearchData.position}</h1> 
      }
      { playerSearchData.stats &&
        <>
          <h2>Past Seasons</h2>
          <table className="lineups-table">
            <thead>
              <tr className="col-labels">
                <th colspan="2"></th>
                <th className="col-label" colSpan="3">Passing</th>
                <th className="col-label" colSpan="2">Rushing</th>
                <th className="col-label" colSpan="3">Recieving</th>
                <th className="col-label" colSpan="1">Misc.</th>
              </tr>
              <tr className="table-header">
                <th>Year</th>
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
            { playerSearchData.stats.map((year) => 
              <tr key={year}>
                <td>{year.year}</td>
                <td className="points-col"><strong>{year.stats.fantasy_points}</strong></td>
                <td>{year.stats.passing_yards}</td>
                <td>{year.stats.passing_touchdowns}</td>
                <td>{year.stats.passing_interceptions}</td>
                <td>{year.stats.rushing_yards}</td>
                <td>{year.stats.rushing_touchdowns}</td>
                <td>{year.stats.receptions}</td>
                <td>{year.stats.recieving_yards}</td>
                <td>{year.stats.recieving_touchdowns}</td>
                <td>{year.stats.fumbles_lost}</td>
              </tr>
            )}
            </tbody>
          </table>
        </> 
      }
      { lastSeason && lastSeason.stats &&
        <>
          <h2>2021 Season</h2>
          <table className="lineups-table">
            <thead>
              <tr className="col-labels">
                <th colspan="3"></th>
                <th className="col-label" colSpan="3">Passing</th>
                <th className="col-label" colSpan="2">Rushing</th>
                <th className="col-label" colSpan="3">Recieving</th>
                <th className="col-label" colSpan="1">Misc.</th>
              </tr>
              <tr className="table-header">
                <th>Week</th>
                <th>Game</th>
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
            {lastSeason.stats.map((week) =>
              <tr>
                <td>{week.week}</td>
                <td>{week.game}</td>
                <td className="points-col"><strong>{week.fantasy_points}</strong></td>
                <td>{week.passing_yards}</td>
                <td>{week.passing_touchdowns}</td>
                <td>{week.passing_interceptions}</td>
                <td>{week.rushing_yards}</td>
                <td>{week.rushing_touchdowns}</td>
                <td>{week.receptions}</td>
                <td>{week.recieving_yards}</td>
                <td>{week.recieving_touchdowns}</td>
                <td>{week.fumbles_lost}</td>
              </tr>
            )}
            </tbody>
          </table>
        </>
      }
    </div>
  )
}

export default PlayerSearch