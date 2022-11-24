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
            <th></th>
            <th>DraftGroup</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Salary</th>
            <th>Proj. Pts</th>
          </tr>
        </thead>
        <tbody>
          {lineups.length > 0 && lineups.slice((currPage * 50), 50 + ((currPage) * 50)).map((lineup) => 
            <>
              <tr>
                <td><Link to={`/createLineup/${lineup["draft-group"]}/${lineup["lineup-id"]}`}
                  className="view-lineup-btn">Edit<FaAngleRight/></Link></td>
                <td>{lineup["draft-group"]}</td>
                <td>{lineup["startTimeSuffix"]}</td>
                <td>{lineup["minStartTime"]}</td>
                <td>${lineup["salary"] ? lineup["salary"] : 0}</td>
                <td>{lineup["projected-points"] ? lineup["projected-points"] : 0} Pts</td>
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