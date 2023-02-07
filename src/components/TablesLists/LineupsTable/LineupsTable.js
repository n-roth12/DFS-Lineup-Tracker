import { useState, useEffect } from 'react'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './LineupsTable.scss'
import '../../../DefaultTable.scss'
import { capitalize } from '@material-ui/core'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog';
import { FaPlus } from 'react-icons/fa'

const LineupsTable = ({ lineups, filteredYears, selectedLineups, setSelectedLineups, stateFilter }) => {

  const [lineupsPerPage, setLineupsPerPage] = useState(50)
  const [currPage, setCurrPage] = useState(0)
  const [numPages, setNumPages] = useState(Math.ceil(lineups.length / lineupsPerPage))
  const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
	const [createLineupDialogContent, setCreateLineupDialogContent] = useState({})
	const [dialogDraftGroupLineups, setDialogDraftGroupLineups] = useState([])
  const [siteFilter, setSiteFilter] = useState(new Set())

  const nextPage = () => {
    if ((currPage + 1) * lineupsPerPage >= lineups.length) return
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

  const dialogActionWrapper = (slate) => {
		setCreateLineupDialogContent(slate)
		setShowCreateLineupDialog(true)
	}

	const closeDialogWrapper = () => {
		setShowCreateLineupDialog(false)
		setCreateLineupDialogContent({})
	}

  const changeFilter = (site) => {
    if (siteFilter.has(site)) {
      const filterCopy = new Set(siteFilter)
      filterCopy.delete(site)
      setSiteFilter(filterCopy)
    } else {
      setSiteFilter(new Set(siteFilter.add(site)))
    }
    if (siteFilter.size > 2) {
      setSiteFilter(new Set())
    }
  }

  return (
    <div className='lineups-table-wrapper'>
      <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
        onClose={() => setShowCreateLineupDialog(false)} draftGroup={createLineupDialogContent} draftGroupLineups={dialogDraftGroupLineups} />
      <div className='lineups-table-wrapper-inner'>
        <div className='table-header-wrapper'>
          <div className="pos-filter-wrapper">
            <div>
              <button 
                className={`filter-btn${siteFilter.size < 1 ? "-active" : ""}`} 
                onClick={() => setSiteFilter(new Set())}>All
              </button>
              <button 
                className={`filter-btn${siteFilter.has("draftkings") ? "-active" : ""}`} 
                onClick={() => changeFilter("draftkings")}>DraftKings
              </button>
              <button
                className={`filter-btn${siteFilter.has("yahoo") ? "-active" : ""}`} 
                onClick={() => changeFilter("yahoo")}>Yahoo
              </button>
              <button 
                className={`filter-btn${siteFilter.has("fanduel") ? "-active" : ""}`} 
                onClick={() => changeFilter("fanduel")}>Fanduel
              </button>
            </div>
          </div>
          <div className='lineup-wrapper-header'>
            {stateFilter === "upcoming" && <Link to='/upcoming' className='lineup-options-btn'>Create Lineup <FaPlus className='icon'/></Link>}
            {/* {selectedLineups.length > 0 &&
              <button className='lineup-delete-btn' onClick={() => setShowDeleteLineupsDialog(true)}>Delete Lineups ({selectedLineups.length})</button>
            } */}
          </div>
        </div>
        <span className='page-btn-wrapper'>
          <span className={currPage > 0 ? "page-arrow-active" : "page-arrow"} onClick={prevPage}> <FaAngleLeft /></span>
          {[...Array(numPages)].map((x, i) => 
            <span className={currPage === i ? 'page-btn-active' : 'page-btn'} onClick={() => setCurrPage(i)}>{i + 1}</span>
          )}
          <span className={(currPage + 1) * lineupsPerPage < lineups.length ? "page-arrow-active" : "page-arrow"} onClick={nextPage}><FaAngleRight /></span>
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
        {lineups.length > 0 &&
          <tbody>
            {lineups.filter((lineup) => siteFilter.size < 1 || siteFilter.has(lineup["site"])).slice((currPage * lineupsPerPage), lineupsPerPage + ((currPage) * lineupsPerPage)).map((lineup) => 
              <>
                <tr>
                  <td><input type="checkbox" checked={selectedLineups.includes(lineup["lineupId"])} onClick={() => toggleSelectedLineup(lineup["lineupId"])}></input></td>
                  <td><Link to={`/createLineup/${lineup["draftGroupId"]}/${lineup["lineupId"]}`}
                    className="view-lineup-btn">Edit</Link></td>
                  <td>{capitalize(lineup["site"])}</td>
                  <td>{lineup["startTimeSuffix"] ? lineup["startTimeSuffix"].replace(")", "").replace("(", "") : "Main"}</td>
                  <td>{lineup["startTime"].split("T")[0]} @ {lineup["startTime"].split("T")[1].split(".")[0]}</td>
                  <td>${lineup["salary"] ? lineup["salary"] : 0}{lineup["salaryCap"] ? ` / ${lineup["salaryCap"]}` : ""}</td>
                  <td>{lineup["projectedPoints"] ? lineup["projectedPoints"] : 0}</td>
                </tr>
              </>
            )
          }
          </tbody>
        }
      </table>
      <span className='page-btn-wrapper'>
        <span className={currPage > 0 ? "page-arrow-active" : "page-arrow"} onClick={prevPage}> <FaAngleLeft /></span>
        {[...Array(numPages)].map((x, i) => 
          <span className={currPage === i ? 'page-btn-active' : 'page-btn'} onClick={() => setCurrPage(i)}>{i + 1}</span>
        )}
        <span className={(currPage + 1) * lineupsPerPage < lineups.length ? "page-arrow-active" : "page-arrow"} onClick={nextPage}><FaAngleRight /></span>
      </span>
      </div>
    </div>
  )
}

export default LineupsTable