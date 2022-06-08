import { useState, useEffect } from 'react'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const LineupsTable = ({ lineups, filteredYears }) => {

  const [currPage, setCurrPage] = useState(1)

  return (
    <>
      <div>
        <span>{1 + (currPage - 1) * 50} - {currPage * 50} of {lineups.length}</span>
        <span> <FaAngleLeft /> Prev </span>
        <span> Next <FaAngleRight /></span>
      </div>
      <table className="lineups-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Points</th>
            <th>Wager</th>
            <th>Winnings</th>
            <th>Profit</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {lineups.length > 0 && lineups.map((lineup) => 
            <>
              {(filteredYears == null || lineup.year == filteredYears) &&
                <tr>
                  <td>Week {lineup.week}, {lineup.year}</td>
                  <td >{lineup.points > 140 && <FaFire className="icon fire-icon"/>} 
                    {lineup.points < 90 && <FaSnowflake className="icon ice-icon"/>}
                    {lineup.points} PTS</td>
                  <td>${lineup.bet}</td>
                  <td>${lineup.winnings}</td>
                  <td style={{color:lineup.bet > lineup.winnings ? "red" : "green"}}>{`${lineup.bet > lineup.winnings ? "-" : "+"}\$${Math.abs(lineup.winnings - lineup.bet)}`}</td>
                  <td><Link to={`/lineups/${lineup.id}/${lineup.week}/${lineup.year}`}
                    className="view-lineup-btn">Edit Lineup<FaAngleRight/></Link></td>
                </tr>
              }
            </>
          )}
        </tbody>
      </table>
    </>
  )
}

export default LineupsTable