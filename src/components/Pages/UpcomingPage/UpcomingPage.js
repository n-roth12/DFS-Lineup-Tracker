import { useState, useEffect } from 'react'
import './UpcomingPage.scss'
import '../../../DefaultTable.scss'
import PlayerLink from '../../Buttons/PlayerLink/PlayerLink';
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog';
import { Roller } from 'react-awesome-spinners';
import { FaAngleRight, FaPlus } from 'react-icons/fa';
import { BiImport } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '@material-ui/core';
import { FaSearch } from 'react-icons/fa';
import { api_url } from '../../../Constants';

const UpcomingPage = ({ week, year, setAlertMessage, setAlertTime, setAlertColor }) => {

  const [slates, setSlates] = useState([])
  const [players, setPlayers] = useState([])
  const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
  const [createLineupDialogContent, setCreateLineupDialogContent] = useState({})
  const [sortColumn, setSortColumn] = useState(["draftkings", "salary"])
  const [isSortUp, setIsSortUp] = useState(false)
  const [selectedSite, setSelectedSite] = useState("draftkings")
  const [lastUpdate, setLastUpdate] = useState("")
  const [activeSlate, setActiveSlate] = useState({})
  const [activeSlateDraftables, setActiveSlateDraftales] = useState([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [loadingDraftables, setLoadingDraftables] = useState(false)
  const [posFilter, setPosFilter] = useState(new Set())
  const [playerFilter, setPlayerFilter] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    setAlertMessage("Notice: For testing purposes, the site is functioning as though it is still Week 18, 2021, due to the NFL being in offseason.")
    setAlertColor("blue")
    setAlertTime(400000)
    getPlayers()
    getUpcomingSlates()
  }, [])

  useEffect(() => {
    getDraftables()
  }, [activeSlate])

  useEffect(() => {
    if (slates.length > 0) {
      setActiveSlate(slates.filter((slate) => slate["site"] === selectedSite)[0])
    }
  }, [selectedSite])

  const getUpcomingSlates = async () => {
    const res = await fetch(`${api_url}/upcoming/slates_new`, {
      method: 'GET'
    })
    const data = await res.json()

    setSlates(data)
    setActiveSlate(data.find((slate) => slate["site"] === selectedSite))
  }

  const getDraftables = async () => {
    if (activeSlate && activeSlate["draftGroupId"] != null && selectedSite) {
      setLoadingDraftables(true)
      const res = await fetch(`${api_url}/upcoming/draftables?draftGroupId=${activeSlate["draftGroupId"]}&site=${selectedSite}`, {
        method: 'GET',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        }
      })
      const data = await res.json()
      setActiveSlateDraftales(data)
      setLoadingDraftables(false)
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

  const getPlayers = async () => {
    const res = await fetch(`${api_url}/upcoming/ownership`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const result = await res.json()
    setPlayers(result["players"])
    setLastUpdate(result["last-update"])
  }

  const sortRows = (site, attribute) => {
    if (attribute === "name") {
      setPlayers([...players].sort((a, b) => a[attribute] >= b[attribute] ? (isSortUp ? 1 : -1) : (isSortUp ? -1 : 1)))
    } else {
      setPlayers([...players].sort((a, b) =>
        (a["stats"][site] && b["stats"][site] && a["stats"][site][attribute] >= b["stats"][site][attribute]) || !b["stats"][site]
          ? (isSortUp ? 1 : -1)
          : (isSortUp ? -1 : 1)))
    }
    setIsSortUp(!isSortUp)
    setSortColumn([site, attribute])
  }

  const createLineup = async (draftGroup) => {
    const res = await fetch(`${api_url}/lineups/createEmptyLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroup["draftGroupId"],
        "startTime": draftGroup["startTime"],
        "endTime": draftGroup["endTime"],
        "site": draftGroup["site"],
        "startTimeSuffix": draftGroup["startTimeSuffix"],
        "salaryCap": draftGroup["salaryCap"]
      })
    })
    const data = await res.json()
    const lineupId = data["lineupId"]
    navigate(`/createLineup/${draftGroup["draftGroupId"]}/${lineupId}`)
  }

  const togglePosFilter = (position) => {
    if (posFilter.has(position)) {
      const filterCopy = new Set(posFilter)
      filterCopy.delete(position)
      setPosFilter(filterCopy)
    } else {
      setPosFilter(new Set(posFilter.add(position)))
    }
  }

  return (
    <div className="upcoming-page page">
      <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog}
        onClose={closeDialogWrapper} draftGroup={createLineupDialogContent} />
      <div className='site-filter-wrapper'>
        <div className='site-filter-wrapper-inner'>
          <button className={`underline-btn${selectedSite === "draftkings" ? " active" : ""}`}
            onClick={() => setSelectedSite("draftkings")}>DraftKings</button>
          <button className={`underline-btn${selectedSite === "yahoo" ? " active" : ""}`}
            onClick={() => setSelectedSite("yahoo")}>Yahoo</button>
          <button className={`underline-btn${selectedSite === "fanduel" ? " active" : ""}`}
            onClick={() => setSelectedSite("fanduel")}>Fanduel</button>
        </div>
      </div>
      <div className='slatesWrapper-outer'>
        {slates.length && activeSlate ?
          <>
            <div className="slatesWrapper">
              {slates.length > 0 ? slates.map((slate) => (
                slate["site"] === selectedSite &&
                <div className={`slate${activeSlate["draftGroupId"] == slate["draftGroupId"] ? " active" : ""}`} onClick={() => setActiveSlate(slate)}>
                  <p>{slate["startTimeSuffix"] ? slate["startTimeSuffix"].replace(")", "").replace("(", "") : "Main"}</p>
                  <p>{slate["games"].length} Games</p>
                  <p onClick={(e) => { e.stopPropagation(); dialogActionWrapper(slate) }} className='link-btn'>Details <FaAngleRight /></p>
                </div>
              ))
                :
                <h3>No Slates Found</h3>
              }
            </div>
          </>
          :
          <div className='loading-screen'>
            <h3><Roller /></h3>
          </div>
        }
      </div>

      {!loadingDraftables ? <>
        {activeSlate && Object.keys(activeSlateDraftables).length > 0 &&
          <div className='players-outer'>
            <div className='players-outer-header'>
              <h2><span>{capitalize(selectedSite)}</span> <span className='slate-title'>{activeSlate["startTimeSuffix"] ? activeSlate["startTimeSuffix"] : "(Main)"}</span></h2>
              <div className='btn-wrapper'>
                <button className='lineup-options-btn' onClick={() => createLineup(activeSlate)}><FaPlus className='icon'/> New Lineup</button>
              </div>
            </div>
            <div className='filters-outer'>
              <div className="pos-filter-wrapper">
                <div className='pos-filter-wrapper-inner'>
                  <button
                    className={`filter-btn${posFilter.size < 1 ? "-active" : ""}`}
                    onClick={() => setPosFilter(new Set())}>All
                  </button>
                  <button
                    className={`filter-btn${posFilter.has("qb") ? "-active" : ""}`}
                    onClick={() => togglePosFilter("qb")}>QB
                  </button>
                  <button
                    className={`filter-btn${posFilter.has("rb") ? "-active" : ""}`}
                    onClick={() => togglePosFilter("rb")}>RB
                  </button>
                  <button
                    className={`filter-btn${posFilter.has("wr") ? "-active" : ""}`}
                    onClick={() => togglePosFilter("wr")}>WR
                  </button>
                  <button
                    className={`filter-btn${posFilter.has("te") ? "-active" : ""}`}
                    onClick={() => togglePosFilter("te")}>TE
                  </button>
                  <button
                    className={`filter-btn${posFilter.has("dst") ? "-active" : ""}`}
                    onClick={() => togglePosFilter("dst")}>DST
                  </button>
                </div>
              </div>
              <div className="player-search">
                <input type="text" placeholder="Search Player" className="search-input" value={playerFilter}
                  onChange={(e) => setPlayerFilter(e.target.value)}></input>
                <button className="search-btn" type="button"><FaSearch /></button>

              </div>
            </div>
            <div className='players-inner'>
              <table className='lineups-table'>
                <thead>
                  <tr className='header-labels'>
                    <th className={sortColumn[1] === "name" ? "selected" : ""}
                      onClick={() => sortRows("", "name")}>Name</th>
                    <th className={sortColumn[1] === "position" ? "selected" : ""}
                      onClick={() => sortRows("fanduel", "position")}>Pos</th>
                    <th className={sortColumn[1] == "game" ? "selected" : ""}
                      onClick={() => sortRows("fanduel", "game")}>Game</th>
                    <th className={sortColumn[1] == "oprk" ? "selected" : ""}
                      onClick={() => sortRows("fanduel", "oprk")}>OPRK</th>
                    <th className={sortColumn[0] === "fanduel" && sortColumn[1] === "ownership_projection" ? "selected" : ""}
                      onClick={() => sortRows("fanduel", "ownership_projection")}>FPPG</th>
                    <th className={sortColumn[0] === "fanduel" && sortColumn[1] === "salary" ? "selected" : ""}
                      onClick={() => sortRows("fanduel", "salary")}>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSlateDraftables.map((data) => (
                    (playerFilter.length < 1 || data["displayName"].toLowerCase().startsWith(playerFilter.toLowerCase())) &&
                    (posFilter.size < 1 || posFilter.has(data.position.toLowerCase())) &&
                    <tr>
                      <td className='player-col'><strong><PlayerLink playerName={`${data["firstName"]} ${data["lastName"]}`} /></strong></td>
                      <td>{data["position"]}</td>
                      <td><span className={data["team"] === data["game"]["homeTeam"] ? "bold" : ""}>{data["game"]["homeTeam"]}</span> @ <span className={data["team"] === data["game"]["awayTeam"] ? "bold" : ""}>{data["game"]["awayTeam"]}</span></td>
                      <td>{data["oprk"]}</td>
                      <td>{data["fppg"]}</td>
                      <td>${data["salary"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }</> : <Roller />}
    </div>
  )
}
export default UpcomingPage
