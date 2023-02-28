import { useState, useEffect } from 'react'
import './PastLineupPage.scss'
import { Link, useParams } from 'react-router-dom'
import { FaPlus, FaSearch, FaTimes, FaArrowUp } from 'react-icons/fa'
import { GrRevert } from 'react-icons/gr'
import { BiDownload, BiBlock } from 'react-icons/bi'
import { AiOutlineStar, AiOutlineMinusCircle } from 'react-icons/ai'
import PlayerLink from '../../Buttons/PlayerLink/PlayerLink'
import PastLineup from '../SingleLineupPage/Lineup/PastLineup/PastLineup'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog'
import GenerateLineupDialog from '../../Dialogs/GenerateLineupDialog/GenerateLineupDialog'
import PlayerDialog from '../../Dialogs/PlayerDialog/PlayerDialog'
import { capitalize } from '@material-ui/core'
import { Roller } from 'react-awesome-spinners'
import DeleteLineupsDialog from '../../Dialogs/DeleteLineupsDialog/DeleteLineupsDialog'
import { useNavigate } from 'react-router-dom'

const PastLineupPage = ({ setAlertMessage, setAlertColor, setAlertTime }) => {

  const { draftGroupId, lineupId } = useParams()
  const [draftables, setDraftables] = useState([])
  const [activeOption, setActiveOption] = useState("custom")
  const [editingPos, setEditingPos] = useState()
  const [playerFilter, setPlayerFilter] = useState("")
  const [posFilter, setPosFilter] = useState(new Set())
  const [remainingSalary, setRemainingSalary] = useState() 
  const [prevLineup, setPrevLineup] = useState({})
  const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
  const [draftGroup, setDraftGroup] = useState()
  const [teamProjectedPoints, setTeamProjectedPoints] = useState(0)
  const [draftGroupLineups, setDraftGroupLineups] = useState([])
  const [lineupPlayerIds, setLineupPlayerIds] = useState(new Set())
  const [playerDialogContent, setPlayerDialogContent] = useState()
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [showGenerateLineupDialog, setShowGenerateLineupDialog] = useState(false)
  const [teamsFilter, setTeamsFilter] = useState([])
  const [loading, setLoading] = useState(true)
  const [playerTableSort, setPlayerTableSort] = useState("salary")
  const [isPlayerTableSortDesc, setIsPlayerTableSortDesc] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [file, setFile] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [stateFilter, setStateFilter] = useState("all")
  const [favoritesIds, setFavoritesIds] = useState([])
  const [hiddenIds, setHiddenIds] = useState([])
  const [showEditLineup, setShowEditLineup] = useState(false)
  const [pastDraftablesData, setPastDraftablesData] = useState([])
  const navigate = useNavigate()

  const [lineup, setLineup] = useState({
    "qb": null,
    "wr1": null,
    "wr2": null,
    "wr3": null,
    "rb1": null,
    "rb2": null,
    "te": null,
    "flex": null,
    "dst": null
  })
  
  const lineupSlots = {
    "qb": 
      {
        "label": "QB",
        "allowedPositions": ["qb"],
        "lineupIndex": 0
      }
    ,
      "rb1": 
      {
        "label": "RB",
        "allowedPositions": ["rb"],
        "lineupIndex": 1
      }
      ,
      "rb2": 
      {
        "label": "RB",
        "allowedPositions": ["rb"],
        "lineupIndex": 2
      },
      "wr1": 
      {
        "label": "WR",
        "allowedPositions": ["wr"],
        "lineupIndex": 3
      },
      "wr2": 
      {
        "label": "WR",
        "allowedPositions": ["wr"],
        "lineupIndex": 4
      },
      "wr3":
      {
        "label": "WR",
        "allowedPositions": ["wr"],
        "lineupIndex": 5
      },
      "te":
      {
        "label": "TE",
        "allowedPositions": ["te"],
        "lineupIndex": 6
      },
      "flex":
      {
        "label": "FLEX",
        "allowedPositions": ["rb", "wr", "te"],
        "lineupIndex": 7
      },
      "dst":
      {
        "label": "DEF",
        "allowedPositions": ["dst"],
        "lineupIndex": 8
    }
  }

  useEffect(() => {
    setShowCreateLineupDialog(false)
    getLineup()
    getDraftGroup()
    getDraftGroupLineups()
    getPastDraftablesData()
    setTimeout(() => setLoading(false), 1500)
  }, [draftGroupId, lineupId])

  useEffect(() => {
    getRemainingSalary()
    getTeamProjPoints()
    getLineupPlayerIds()
  }, [lineup, draftGroup])

  const togglePosFilter = (position) => {
    if (posFilter.has(position)) {
      const filterCopy = new Set(posFilter)
      filterCopy.delete(position)
      setPosFilter(filterCopy)
    } else {
      setPosFilter(new Set(posFilter.add(position)))
    }
    setEditingPos(null)
  }

  const getLineupPlayerIds = () => {
    const temp = new Set()
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        temp.add(lineupSlot["playerSiteId"])
      }
    }
    setLineupPlayerIds(temp)
  }

  const getLineup = async () => {
    if (lineupId) {
      const res = await fetch(`/lineups/lineup?lineupId=${lineupId}`, {
        method: 'GET',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        }
      })
      const data = await res.json()
      setLineup(data["lineup"])
      setPrevLineup(data["lineup"])
      data["favorites"] && setFavoritesIds(data["favorites"].map((player) => player["playerSiteId"]))
      data["hidden"] && setHiddenIds(data["hidden"].map((player) => player["playerSiteId"]))
    } else {
      setPrevLineup(lineup)
    } 
  }

  const toggleGameWrapper = (team1, team2) => {
    if (teamsFilter.includes(team1)) {
      setTeamsFilter(teamsFilter.filter((team) => team !== team1 && team !== team2))
    } else {
      setTeamsFilter([...teamsFilter, team1, team2])
    }
  }

  const getDraftGroup = async () => {
    const res = await fetch(`/upcoming/draftGroup?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setDraftGroup(data)
  }

  const getPastDraftablesData = async () => {
    const res = await fetch(`/history/playergamestats?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setPastDraftablesData(data)
  }

  const getDraftGroupLineups = async () => {
    const res = await fetch(`/users/lineups/draftGroup?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setDraftGroupLineups(data)
  }

  const filterPlayers = (players) => {
    const results =  players.filter((player) => {
      return (playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase()))
    })
  }

  const toggleEditingPos = (position) => {
    if (editingPos === position) {
      setEditingPos(null)
      setPosFilter(new Set())
    } else {
      setEditingPos(position)
      setPosFilter(new Set(lineupSlots[position]["allowedPositions"]))
    }
  }

  const deleteFromLineup = (position) => {
    var lineupCopy = {...lineup}
    lineupCopy[`${position}`] = null
    setLineup(lineupCopy)
    setEditingPos(null)
    setHasChanges(true)
  }

  const editLineup = (pos) => {
    setEditingPos(pos)
  }

  const cancelEdit = () => {
    setEditingPos(null)
    setPosFilter(new Set())
  }

  const openDialog = () => {
    return
  }

  const clearLineup = () => {
    var lineupCopy = { ...lineup }
    Object.keys(lineup).forEach((lineupSlot) => {
      lineupCopy[lineupSlot] = null
    })
    setLineup(lineupCopy)
    setHasChanges(true)
  }

  const saveLineup = async () => {
    if (lineupId === "null") {
      setAlertColor("red")
      setAlertMessage("Must be logged in to save a lineup!")
      return
    }
    const projectedPoints = getTeamProjPoints()
    const res = await fetch(`/lineups/updateLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "lineup": lineup,
        "draftGroupId": draftGroupId,
        "lineupId": lineupId,
        "salary": draftGroup["salaryCap"] - remainingSalary,
        "projectedPoints": teamProjectedPoints,
        "projectedOwn": 120,
        "startTime": draftGroup["startTime"],
        "endTime": draftGroup["endTime"],
        "startTimeSuffix": draftGroup["startTimeSuffix"],
        "site": draftGroup["site"],
        "salaryCap": draftGroup["salaryCap"]
      })
    })
    .then(() => {
      setPrevLineup(lineup)
      if (remainingSalary < 0) {
        setAlertColor("green")
        setAlertMessage("Lineup Saved with Warning: Lineup over the salary cap!")
        setAlertTime(4000)
      } else {
        setAlertColor("green")
        setAlertMessage("Lineup Saved")
        setAlertTime(4000)
      }
      setHasChanges(false)
      setShowEditLineup(false)
    })
    .catch((error) => {
      setAlertColor("red")
      setAlertMessage("Error while saving lineup!")
    })
  }

  const addToLineup = (pos, player) => {
    if (pos) {
      var lineupCopy = {...lineup}
      lineupCopy[pos] = player
      setLineup(lineupCopy)
      setEditingPos(null)
      setHasChanges(true)
    } else {
      for (const [k, v] of Object.entries(lineup)) {
        if (v === null && lineupSlots[k]["allowedPositions"].includes(player["position"].toLowerCase())) {
          var lineupCopy = { ...lineup }
          lineupCopy[`${k}`] = player
          setLineup(lineupCopy)
          setHasChanges(true)
          return
        } 
      }
    }
  }

  const getTeamProjPoints = () => {
    var projectedPoints = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        projectedPoints += parseFloat(lineupSlot["fppg"])
      }
    }
    setTeamProjectedPoints(parseFloat(projectedPoints).toFixed(2))
  }

  const canQuickAdd = (player) => {
    if (lineupPlayerIds.has(player["playerSiteId"])) {
      return false
    }
    for (const [k, v] of Object.entries(lineup)) {
      if ((v === null && lineupSlots[k]["allowedPositions"].includes(player["position"].toLowerCase() ))
        || (editingPos && lineupSlots[editingPos]["allowedPositions"].includes(player["position"].toLowerCase()))) {
        return true
      }
    }
    return false
  }

  const addPlayerToFavorites = async (player) => {
    setFavoritesIds([...favoritesIds, player["playerSiteId"]])
    if (lineupId !== "null") {
      const res = await fetch(`/lineups/favorite`, {
        method: 'POST',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        },
        body: JSON.stringify({
          "lineupId": lineupId,
          "player": player
        })
      })
      const data = await res.json()
    }
  }

  const addPlayerToHidden = async (player) => {
    setHiddenIds([...hiddenIds, player["playerSiteId"]])
    setFavoritesIds(favoritesIds.filter((playerId) => playerId !== player["playerSiteId"]))
    if (lineupId !== "null") {
      const res = await fetch(`/lineups/hidden`, {
        method: 'POST',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        },
        body: JSON.stringify({
          "lineupId": lineupId,
          "player": player
        })
      })
      const data = await res.json()
    }
  }

  const removePlayerFromFavorites = (player) => {
    setFavoritesIds(favoritesIds.filter((playerId) => playerId !== player["playerSiteId"]))
  }

  const removePlayerFromHidden = (player) => {
    setHiddenIds(hiddenIds.filter((playerId) => playerId !== player["playerSiteId"]))
  }

  const exportLineup = async () => {
    const res = await fetch(`/lineups/export`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify(lineup)
    })
    const data = await res.blob()
    downloadFile(data)
  }

  const downloadFile = (blob) => {
    const url = window.URL.createObjectURL(blob)
    setFile(url)
  }

  const getRemainingSalary = () => {
    if (draftGroup) {
      var remaining = draftGroup["salaryCap"]
      for (const [k,  lineupSlot] of Object.entries(lineup)) {
        if (lineupSlot !== null) {
          remaining -= lineupSlot["salary"]
        }
      }
      setRemainingSalary(remaining)
    }
  }

  const getRemainingSalaryPerPlayer = () => {
    const emptySlotsCount = Object.values(lineup).filter((lineupSlot) => lineupSlot == null).length
    if (emptySlotsCount < 1) {
      return "-"
    }
    return remainingSalary < 0 ? "-$" + Math.round(Math.abs(remainingSalary) / emptySlotsCount) : "$" + Math.round(remainingSalary / emptySlotsCount)
  }

  const revertLineup = () => {
    setLineup(prevLineup)
    setLineupPlayerIds(new Set())
    setHasChanges(false)
  }

  const changeStateFilter = (state) => {
    setStateFilter(state)
    setPosFilter(new Set())
    setTeamsFilter([])
    setPlayerFilter("")
    setEditingPos()
  }

  const playerWrapper = (player) => {
    setPlayerDialogContent(player)
    setShowPlayerDialog(true)
  }

  const applyOptimizedLineup = (generatedLineup) => {
    var result = {}
    generatedLineup.map((player) => {
      result[player["position"]] = Object.keys(player["player"]).length > 0 ? player["player"] : null
    })
    setLineup(result)
    setShowGenerateLineupDialog(false)
  }

  const deleteLineup = async () => {
    const res = await fetch('/lineups/delete', {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "lineups": [lineup["lineupId"]]
      })
    })
    setShowDeleteDialog(false)
		navigate(`/lineups`)
    setAlertMessage("Lineup Deleted", "green")
  }


  return (
    <div className="pastLineupPage page">
      {loading === false ? <>
      {draftGroup !== null &&
        <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
				  onClose={() => setShowCreateLineupDialog(false)} 
          draftGroup={draftGroup} draftGroupLineups={draftGroupLineups} />
      }
      {draftGroup !== null &&
        <GenerateLineupDialog showGenerateLineupDialog={showGenerateLineupDialog} 
          onClose={() => setShowGenerateLineupDialog(false)} 
          draftGroupId={draftGroupId}
          games={draftGroup["games"]}
          onApply={applyOptimizedLineup} />
      }
      <PlayerDialog showPlayerDialog={showPlayerDialog} 
          onClose={() => {setPlayerDialogContent({}); setShowPlayerDialog(false)}} 
          player={playerDialogContent} />

      <DeleteLineupsDialog showDeleteLineupsDialog={showDeleteDialog}
        onClose={() => setShowCreateLineupDialog(false)}
        deleteLineups={deleteLineup}
        lineupsToDelete={[lineup]}
      />
      <div className="header">
        {draftGroup &&
          <div className="header-inner">
            <div className='header-upper'>
              <div className="header-label">
                <p className="site">{capitalize(draftGroup["site"])} Lineup</p>
              </div>
            </div>
            <div className='header-lower'>
              <div className='header-details'>
                <div className='info-block'>
                  <p className="date">Slate</p>
                  <p><strong>{draftGroup["startTimeSuffix"].replace("(", " ").replace(")", "")}</strong></p>
                </div>
                <div className='info-block'>
                  <p>Games</p>
                  <p><strong>{draftGroup["games"].length}</strong></p>
                </div>
                <div className='info-block'>
                  <p>Start Time:</p>
                  <p><strong>{new Date(`${draftGroup["startTime"]}`).toDateString()}</strong></p>
                </div>
              </div>
              <div className='header-options'>
                {showEditLineup ?
                  <button onClick={saveLineup}>Save</button>
                :
                  <button className='generate-btn' onClick={() => setShowEditLineup(true)}>Edit</button>
                }
                <button className="generate-btn" onClick={() => setShowCreateLineupDialog(true)}>Compare</button>
                {file === null ?
                  <button className='generate-btn' onClick={exportLineup}>Export</button>
                :
                  <a className='generate-btn' href={file} download={`lineups_${draftGroup["draftGroupId"]}.csv`}>Download<BiDownload className='download-icon'/></a>
                }
                <button className='generate-btn generate-btn-delete' onClick={() => setShowDeleteDialog(true)}>Delete</button>
              </div>
            </div>
          </div>
        }
      </div>
      <div className='createLineupPage-inner'>
        <div className='lineup-outer'>
          <div className='title'>
            <h2>Lineup</h2>
            <h2>138.2 Pts</h2>
          </div>
          <PastLineup lineup={lineup} 
            onDelete={deleteFromLineup} 
            onAdd={editLineup}
            editingPos={editingPos}
            cancelEdit={cancelEdit} 
            onOpenDialog={openDialog}
            toggleEditingPos={toggleEditingPos}
            setPlayerDialogContent={playerWrapper} />
        </div>
        
        {pastDraftablesData.length > 0 ?
          <div className='players-table-wrapper'>
            <div className='filter-btn-wrapper'>
              <h2>Players</h2>
            </div>
            {draftGroup && draftGroup["games"].length > 1 &&
            <div className='games-outer'>
              <div className='games-inner'>
                <div className={`game all ${teamsFilter.length < 1 ? " selected" : ""}`} onClick={() => setTeamsFilter([])}>
                  <p>All</p>
                </div>
                {draftGroup && draftGroup["games"] && draftGroup["games"].length > 0 && draftGroup["games"].map((game) => 
                  <div className={`game ${teamsFilter.includes(game["awayTeam"]) && teamsFilter.includes(game["awayTeam"]) ? "selected": ""}`} 
                    onClick={() => toggleGameWrapper(game["awayTeam"], game["homeTeam"])}>
                    <p>{game["awayTeam"]}</p>
                    <p>@{game["homeTeam"]}</p>
                  </div>
                )}
              </div>
            </div>
          }
            <div className='players-table-header'>
              <div className='players-table-header-upper'>
              </div>
              <div className='players-table-header-lower'>
                <div className="pos-filter-wrapper">
                  <div>
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
                  <div>
                    <input type="text" placeholder="Search Player" className="search-input" value={playerFilter}
                    onChange={(e) => setPlayerFilter(e.target.value)}></input>
                  </div>
                  <button className="search-btn" type="button"><FaSearch /></button>
                </div>
              </div>
            </div>
            <table className='lineups-table'>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Name</th>
                  <th>Points</th>
                  <th>Salary</th>
                  <th>Game</th>
                  <th>Stats</th>
                </tr>
              </thead>
              <tbody>
                {stateFilter === "all" && pastDraftablesData.map((player, index) => 
                  (!hiddenIds.includes(player["playerSiteId"])) &&
                  (playerFilter.length < 1 || player.displayName.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
                  (editingPos == null || lineupSlots[editingPos]["allowedPositions"].includes(player.position.toLowerCase())) &&
                  (posFilter.size < 1 || posFilter.has(player.position.toLowerCase())) &&
                  (teamsFilter.length < 1 || teamsFilter.includes(player["team"])) &&
                    <tr>
                      <td>{player.position}</td>
                      <td className='name-col player-name' onClick={() => playerWrapper(player)}>{player.displayName} {player.status !== "" && `(${player.status})`}</td>
                      <td>{player["stats"]["stats"] ? parseFloat(player["stats"]["stats"]["fantasy_points"]).toFixed(2) : ""} PTS</td>
                      <td>${player.salary}</td>
                      <td>{player["game"] ? `${player["game"]["awayTeam"]} 17 @ ${player["game"]["homeTeam"]} 24` : ''}</td>
                      <td className='statsDisplay-wrapper'>{player["statsDisplay"] && player["statsDisplay"].map((stat) => 
                        <span className='statsDisplay'>
                          <span className='value'>{stat["value"]}</span>
                          <span className='key'>{stat["key"]}</span>
                        </span>
                      )}</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        : <h2>Loading Players...</h2>
        }
      </div>
    </>
    :
    <div className='loading-wrapper'>
      <Roller />
    </div>
    }
    </div>
  )
}

export default PastLineupPage