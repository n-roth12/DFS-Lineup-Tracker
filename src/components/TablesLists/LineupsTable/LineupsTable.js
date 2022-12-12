import { useState, useEffect } from 'react'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './LineupsTable.scss'
import { capitalize } from '@material-ui/core'

const LineupsTable = ({ lineups, filteredYears, selectedLineups, setSelectedLineups }) => {

  const [currPage, setCurrPage] = useState(0)

  const nextPage = () => {
    if ((currPage + 1) * 20 >= lineups.length) return
    setCurrPage(currPage + 1)
  }

  const prevPage = () => {
    if (currPage <= 0) return
    setCurrPage(currPage - 1)
  }

  const toggleSelectedLineup = (lineupId) => {
    if (!selectedLineups.includes(lineupId)) {
      setSelectedLineups(selectedLineups.concat(lineupId))
    } else {
      setSelectedLineups(selectedLineups.filter((lineup_id) => lineup_id !== lineupId))
    }
  }

  return (
    <div className='lineups-table-wrapper'>
      <div className='lineups-table-wrapper-inner'>
      <span className="page-btn-wrapper">
        <span className="page-label">{1 + (currPage * 20)} - {Math.min((currPage + 1) * 20, lineups.length)} of {lineups.length}</span>
        {currPage > 0 &&
          <>
            <span className="view-lineup-btn" onClick={prevPage}> <FaAngleLeft /> Prev </span>
          </>
        }
        {(currPage + 1) * 20 < lineups.length &&
          <>
            <span className="view-lineup-btn" onClick={nextPage}> Next <FaAngleRight /></span>
          </>
        }
      </span>
      <table className="lineups-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Site</th>
            <th>Slate</th>
            <th>Date</th>
            <th>Salary</th>
            <th>Proj. Pts</th>
          </tr>
        </thead>
        <tbody>
          {lineups.length > 0 && lineups.slice((currPage * 20), 20 + ((currPage) * 20)).map((lineup) => 
            <>
              <tr>
                <td><input type="checkbox" checked={selectedLineups.includes(lineup["lineupId"])} onClick={() => toggleSelectedLineup(lineup["lineupId"])}></input></td>
                <td><Link to={`/createLineup/${lineup["draftGroupId"]}/${lineup["lineupId"]}`}
                  className="view-lineup-btn">Edit<FaAngleRight/></Link></td>
                <td>{capitalize(lineup["site"])}</td>
                <td>{lineup["startTimeSuffix"] ? lineup["startTimeSuffix"].replace(")", "").replace("(", "") : "Main"}</td>
                <td>{lineup["startTime"].split("T")[0]} @ {lineup["startTime"].split("T")[1].split(".")[0]}</td>
                <td>${lineup["salary"] ? lineup["salary"] : 0}{lineup["salaryCap"] ? `/${lineup["salaryCap"]}` : ""}</td>
                <td>{lineup["projected-points"] ? lineup["projected-points"] : 0} Pts</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <span className="page-btn-wrapper">
        <span className="page-label">{1 + (currPage * 20)} - {Math.min((currPage + 1) * 20, lineups.length)} of {lineups.length}</span>
        {currPage > 0 &&
          <>
            <span className="view-lineup-btn" onClick={prevPage}> <FaAngleLeft /> Prev </span>
          </>
        }
        {(currPage + 1) * 20 < lineups.length &&
          <>
            <span className="view-lineup-btn" onClick={nextPage}> Next <FaAngleRight /></span>
          </>
        }
      </span>
      </div>
    </div>
  )
}

export default LineupsTable