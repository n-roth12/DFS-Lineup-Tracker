

const PlayerSearch = ({ playerSearchData }) => {
  return (
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
  )
}

export default PlayerSearch