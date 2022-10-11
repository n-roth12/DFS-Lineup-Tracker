import { useState, useEffect } from 'react'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './LineupsTable.scss'

const LineupsTable = ({ lineups, filteredYears }) => {

  const [currPage, setCurrPage] = useState(0)

  const nextPage = () => {
    if ((currPage + 1) * 50 >= lineups.length) return
    setCurrPage(currPage + 1)
  }

  const prevPage = () => {
    if (currPage <= 0) return
    setCurrPage(currPage - 1)
  }

  return (
    <div className='lineups-table-wrapper'>
      <span className="page-btn-wrapper">
        <span className="page-label">{1 + (currPage * 50)} - {Math.min((currPage + 1) * 50, lineups.length)} of {lineups.length}</span>
        {currPage > 0 &&
          <>
            <span className="view-lineup-btn" onClick={prevPage}> <FaAngleLeft /> Prev </span>
          </>
        }
        {(currPage + 1) * 50 < lineups.length &&
          <>
            <span className="view-lineup-btn" onClick={nextPage}> Next <FaAngleRight /></span>
          </>
        }
      </span>
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
          {lineups.length > 0 && lineups.slice((currPage * 50), 50 + ((currPage) * 50)).map((lineup) => 
            <>
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
            </>
          )}
        </tbody>
      </table>
      <span className="page-btn-wrapper">
        <span className="page-label">{1 + (currPage * 50)} - {Math.min((currPage + 1) * 50, lineups.length)} of {lineups.length}</span>
        {currPage > 0 &&
          <>
            <span className="view-lineup-btn" onClick={prevPage}> <FaAngleLeft /> Prev </span>
          </>
        }
        {(currPage + 1) * 50 < lineups.length &&
          <>
            <span className="view-lineup-btn" onClick={nextPage}> Next <FaAngleRight /></span>
          </>
        }
      </span>
    </div>
  )
}

export default LineupsTable