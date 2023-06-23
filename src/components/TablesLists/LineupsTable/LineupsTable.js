import { useState, useEffect } from 'react'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './LineupsTable.scss'
import '../../../DefaultTable.scss'
import { Tooltip } from '@material-ui/core'
import PointsGraph from '../../Pages/LineupsPage/PointsGraph/PointsGraph'
import { capitalize } from '@material-ui/core'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog';
import { FaPlus, FaTimes } from 'react-icons/fa'
import { BiDownload, BiTrash, BiExport, BiImport } from 'react-icons/bi'
import { FiSquare, FiMinusSquare } from 'react-icons/fi'
import { AiOutlineImport, AiOutlineExport } from 'react-icons/ai'
import { api_url } from '../../../Constants'

const LineupsTable = ({ lineups, filteredYears, selectedLineups, setSelectedLineups, setShowImportLineupDialog }) => {

  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  const [years, setYears] = useState([2021, 2022, 2023])
  const [lineupsPerPage, setLineupsPerPage] = useState(50)
  const [currPage, setCurrPage] = useState(0)
  const [numPages, setNumPages] = useState(Math.ceil(lineups.length / lineupsPerPage))
  const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
  const [createLineupDialogContent, setCreateLineupDialogContent] = useState({})
  const [dialogDraftGroupLineups, setDialogDraftGroupLineups] = useState([])
  const [siteFilter, setSiteFilter] = useState()
  const [showDeleteLineupsDialog, setShowDeleteLineupsDialog] = useState(false)
  const [yearFilter, setYearFilter] = useState("all")
  const [weekFilter, setWeekFilter] = useState("all")
  const [sortColumn, setSortColumn] = useState("startTime")
  const [reverseSort, setReverseSort] = useState(false)
  const [tagFilter, setTagFilter] = useState([])
  const [file, setFile] = useState(null)

  useEffect(() => {
    getYears()
  }, [lineups])

  const nextPage = () => {
    if ((currPage + 1) * lineupsPerPage >= lineups.length) return
    setCurrPage(currPage + 1)
  }

  const prevPage = () => {
    if (currPage <= 0) return
    setCurrPage(currPage - 1)
  }

  const getYears = () => {
    var temp = [...years]
    lineups && lineups.length > 0 && lineups.map((lineup) => {
      if (!(temp.includes(lineup.year)) && lineup.year) {
        temp.push(lineup.year)
      }
    })
    setYears(temp.sort().reverse())
  }

  const changeYear = (year) => {
    setWeekFilter("all")
    setYearFilter(year)
  }

  const addToTagFilter = (tag) => {
    if (!tagFilter.find((t) => t["category"] === tag["category"] && t["value"] === tag["value"])) {
      setTagFilter([...tagFilter, tag])
    }
  }

  const downloadFile = (blob) => {
    const url = window.URL.createObjectURL(blob)
    setFile(url)
  }

  const deleteLineups = async () => {
    const res = await fetch(`${api_url}/lineups/delete`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: selectedLineups
    })
    const data = await res.json()
    console.log(data)
  }

  const exportLineups = async () => {
    const res = await fetch(`${api_url}/lineups/export`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify(lineups.filter((lineup) =>
        selectedLineups.includes(lineup["lineupId"])).map((lineup) => lineup["lineup"]))
    })
    const data = await res.blob()
    downloadFile(data)
  }

  const changeSortColumn = (column) => {
    if (sortColumn === column) {
      setReverseSort(!reverseSort)
    } else {
      setReverseSort(false)
    }
    setSortColumn(column)
  }

  const selectAllLineups = () => {
    var result = []
    lineups.filter((lineup) =>
      (!siteFilter || siteFilter === lineup["site"])
      && (containsTagFilter(lineup))
      && (yearFilter === "all" || lineup["year"] === parseInt(yearFilter))
      && (weekFilter === "all" || lineup["week"] === parseInt(weekFilter))
    ).map((lineup) => {
      result.push(lineup["lineupId"])
    })
    setSelectedLineups(result)
  }

  const deselectAllLineups = () => {
    setSelectedLineups([])
  }

  const toggleSelectedLineup = (lineupId) => {
    setFile(null)
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
    setSelectedLineups([])
    setSiteFilter(site)
  }

  const containsTagFilter = (lineup) => {
    var failure = true
    if (!tagFilter || tagFilter.length < 1) {
      return true
    }
    if (!lineup["tags"]) {
      return false
    }
    tagFilter.map((tag) => {
      if (!lineup["tags"].find((t) => t["category"] === tag["category"] && t["value"] === tag["value"])) {
        failure = false
      }
    })
    return failure
  }

  const removeTagFilter = (tag) => {
    setTagFilter([...tagFilter.filter((t) => t["category"] !== tag["category"] || t["value"] !== tag["value"])])
  }

  const sortCompare = (a, b) => {
    if (sortColumn === "salary") {
      return reverseSort === true ? parseInt(b["salary"]) - parseInt(a["salary"]) : parseInt(a["salary"]) - parseInt(b["salary"])
    } else if (sortColumn === "startTime") {
      return (reverseSort === true ? a["startTime"].localeCompare(b["startTime"]) : b["startTime"].localeCompare(a["startTime"]))
    } else if (sortColumn === "projectedPoints") {
      return reverseSort === true ? parseInt(b["projectedPoints"]) - parseInt(a["projectedPoints"])
        : parseInt(a["projectedPoints"]) - parseInt(b["projectedPoints"])
    }
  }

  return (
    <div className='lineups-table-wrapper'>
      <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog}
        onClose={() => setShowCreateLineupDialog(false)} draftGroup={createLineupDialogContent} draftGroupLineups={dialogDraftGroupLineups} />
      <div className='lineups-table-wrapper-inner'>
        <div className='table-header-wrapper'>
          <div className='lineups-title'>
            <h1>Upcoming Lineups</h1>
          </div>
          <div className="selectors">
            <select
              className="year-select"
              value={yearFilter}
              onChange={(e) => changeYear(e.target.value)}>
              <option value="all" key="All">All Years</option>
              {years.map((year) =>
                <option value={year} key={year}>{year}</option>
              )}
            </select>
            <select
              className="week-select"
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}>
              <option value="all" key="All">All Weeks</option>
              {weeks.map((week) =>
                !(week > 17 && yearFilter < 2021) &&
                <option value={week} key={week}>Week {week}</option>
              )}
            </select>
          </div>
          <div className='filter-btn-wrapper'>
            <button
              className={`filter-btn${!siteFilter ? "-active" : ""}`}
              onClick={() => setSiteFilter()}>All
            </button>
            <button
              className={`filter-btn${siteFilter === "draftkings" ? "-active" : ""}`}
              onClick={() => changeFilter("draftkings")}>DraftKings
            </button>
            <button
              className={`filter-btn${siteFilter === "yahoo" ? "-active" : ""}`}
              onClick={() => changeFilter("yahoo")}>Yahoo
            </button>
            <button
              className={`filter-btn${siteFilter === "fanduel" ? "-active" : ""}`}
              onClick={() => changeFilter("fanduel")}>Fanduel
            </button>
          </div>
          <div className='tag-filter-wrapper'>
            {tagFilter && tagFilter.map((tag) =>
              <div className='tag-filter'>
                <FaTimes
                  className='delete-icon'
                  onClick={() => removeTagFilter(tag)} />{`${tag["category"]} ${tag["value"] ? `: ${tag["value"]}` : ""}`}
              </div>
            )}
          </div>
        </div>
        <table className="lineups-table">
          <thead>
            <tr className='lineup-wrapper-header'>
              <th colSpan={5} className="options-row" >
                <div className='lineup-options-btns'>
                  {!selectedLineups.length > 0 ?
                    <Tooltip title="Select All">
                      <button className='lineup-options-btn' onClick={selectAllLineups}><FiSquare className='icon' /></button>
                    </Tooltip>
                    :
                    <Tooltip title="De-select All">
                      <button className='lineup-options-btn' onClick={deselectAllLineups} ><FiMinusSquare className='icon' /></button>
                    </Tooltip>
                  }
                  {selectedLineups.length > 0 &&
                    <>
                      {file === null ?
                        <Tooltip title="Export">
                          <button className='lineup-options-btn' onClick={exportLineups}><AiOutlineExport className='icon' /></button>
                        </Tooltip>
                        :
                        <a className='download-btn' href={file} download={`lineups.csv`}>Download<BiDownload className='download-icon' /></a>
                      }
                      <Tooltip title="Delete">
                        <button className='lineup-options-btn' onClick={deleteLineups}><BiTrash className='icon' /></button>
                      </Tooltip>
                    </>
                  }
                  <Tooltip title="Create">
                    <Link to='/upcoming' className='lineup-options-btn'><FaPlus className='add-icon' /></Link>
                  </Tooltip>
                  {selectedLineups.length > 0 &&
                    <span className="selected-counter">{selectedLineups.length} Selected</span>
                  }
                </div>
                <div className='page-btn-wrapper'>
                  <span className={currPage > 0 ? "page-arrow-active" : "page-arrow"} onClick={prevPage}> <FaAngleLeft /></span>
                  <select>
                    {[...Array(numPages)].map((x, i) =>
                      <option className={currPage === i ? 'page-btn-active' : 'page-btn'} onClick={() => setCurrPage(i)}>{i + 1}</option>
                    )}
                  </select>
                  <span className={(currPage + 1) * lineupsPerPage < lineups.length ? "page-arrow-active" : "page-arrow"} onClick={nextPage}><FaAngleRight /></span>
                </div>
              </th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Site</th>
              <th>Slate</th>
              <th>Tags</th>
            </tr>
          </thead>
          {lineups.length > 0 ?
            <tbody>
              {lineups.filter((lineup) =>
                (!siteFilter || siteFilter === lineup["site"])
                && (containsTagFilter(lineup))
                && (yearFilter === "all" || lineup["year"] === parseInt(yearFilter))
                && (weekFilter === "all" || lineup["week"] === parseInt(weekFilter))
              )
                .slice((currPage * lineupsPerPage), lineupsPerPage + ((currPage) * lineupsPerPage))
                .sort((a, b) => sortCompare(a, b))
                .map((lineup) =>
                  <>
                    <tr>
                      <td className='checkbox-wrapper'>
                        <input className='checkbox' type="checkbox"
                          checked={selectedLineups.includes(lineup["lineupId"])}
                          onClick={() => toggleSelectedLineup(lineup["lineupId"])}>
                        </input>
                      </td>
                      <td><Link to={`/createLineup/${lineup["draftGroupId"]}/${lineup["lineupId"]}`} className="view-lineup-btn">Edit</Link></td>
                      <td>{capitalize(lineup["site"])}</td>
                      <td>{lineup["startTimeSuffix"] ? lineup["startTimeSuffix"].replace(")", "").replace("(", "") : "Main"} ({lineup["startTime"].split("T")[0]})</td>
                      <td className='tag-col'>
                        <div className='tags-wrapper'>
                          {lineup["tags"] && lineup["tags"].map((tag) =>
                            <span onClick={() => addToTagFilter(tag)} className='tag'>{`${tag["category"]}${tag["value"] ? `: ${tag["value"]}` : ""}`}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                )
              }
            </tbody>
            : !sessionStorage.dfsTrackerToken ?
              <tbody>
                <tr>
                  <td>You must login to save and view past lineups.</td>
                </tr>
              </tbody>
              : <tbody>
                <tr>
                  <td>No Upcoming Lineups</td>
                </tr>
              </tbody>
          }
        </table>
      </div>
    </div>
  )
}

export default LineupsTable