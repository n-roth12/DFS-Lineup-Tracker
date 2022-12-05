import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa'
import { GrRevert } from 'react-icons/gr'
import PlayerLink from '../../Buttons/PlayerLink/PlayerLink'
import Lineup from '../SingleLineupPage/Lineup/Lineup'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog'
import PlayerDialog from '../../Dialogs/PlayerDialog/PlayerDialog'
import { capitalize } from '@material-ui/core'

const CreateLineupPage = ({ setAlertMessage }) => {

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
    getDraftables()
    getLineup()
    getDraftGroup()
    getDraftGroupLineups()
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

  const getDraftables = async () => {
    const res = await fetch(`/upcoming/players?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    var mySet = new Set()
    var draftables = []
    data.forEach((player) => {
      if (!mySet.has(player["playeSiteId"])) {
        draftables.push(player)
        mySet.add(player["playerSiteId"])
      }
    })
    setDraftables(draftables)
  }

  const getLineup = async () => {
    const res = await fetch(`/lineups/lineup?lineupId=${lineupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setLineup(data["lineup"])
    setPrevLineup(data["lineup"])
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
  }

  const saveLineup = async () => {
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
        setAlertMessage("Lineup Saved with Warning: Lineup over the salary cap!")
      } else {
        setAlertMessage("Lineup Saved")
      }    
    })
    .catch((error) => {
      setAlertMessage("Error while saving lineup!")
    })
  }

  const addToLineup = (pos, player) => {
    if (pos) {
      var lineupCopy = {...lineup}
      lineupCopy[pos] = player
      setLineup(lineupCopy)
      setEditingPos(null)
    } else {
      for (const [k, v] of Object.entries(lineup)) {
        if (v === null && lineupSlots[k]["allowedPositions"].includes(player["position"].toLowerCase())) {
          var lineupCopy = { ...lineup }
          lineupCopy[`${k}`] = player
          setLineup(lineupCopy)
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

  const exportLineup = () => {
    console.log(lineup)
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
    setLineupPlayerIds([])
  }

  const playerWrapper = (player) => {
    setPlayerDialogContent(player)
    setShowPlayerDialog(true)
  }

  return (
    <div className="createLineupPage page">
      {draftGroup !== null &&
        <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
				onClose={() => setShowCreateLineupDialog(false)} draftGroup={draftGroup} draftGroupLineups={draftGroupLineups} />
      }
      <PlayerDialog showPlayerDialog={showPlayerDialog} 
          onClose={() => {setPlayerDialogContent({}); setShowPlayerDialog(false)}} 
          player={playerDialogContent} />
      <div className="header">
        <div className="header-inner">
          <div className="header-label">
            <p className="site">{draftGroup && capitalize(draftGroup["site"])} Lineup</p>
            <p className="date">{draftGroup && draftGroup["startTimeSuffix"]}</p>
          </div>
          <div className="header-options">
            <button 
              className={`${activeOption === "custom" ? "active" : ""}`}
              onClick={() => setActiveOption("custom")}
              >Custom
            </button>
            <button 
              className={`${activeOption === "generate" ? "active" : ""}`}
              onClick={() => setActiveOption("generate")}
              >Generate
            </button>
            <button 
              className={`${activeOption === "import" ? "active" : ""}`}
              onClick={() => setActiveOption("import")}
            >Import</button>
            <button
              className={`${activeOption === "export" ? "active" : ""}`}
              onClick={exportLineup}
            >Export</button>
          </div>
        </div>
      </div>
      <div className='games-outer'>
        <div className='games-inner'>
        {draftGroup && draftGroup["games"] && draftGroup["games"].length > 0 && draftGroup["games"].map((game) => 
          <div className='game'>
            <p>{game["awayTeam"]} @ {game["homeTeam"]}</p>
          </div>
        )}
        </div>
      </div>
      <div className='createLineupPage-inner'>
        <div className='lineup-outer'>
          <div className='title'>
            <h2>Lineup</h2>
            <button className="view-all-btn" onClick={() => setShowCreateLineupDialog(true)}>View All</button>
          </div>
          <div className='lineup-header'>
            <div className='lineup-header-info-wrapper'>
              <div className='lineup-header-info'>
                <p>Remaining Salary <strong>{remainingSalary > 0 ? "$" + remainingSalary : "-$" + Math.abs(remainingSalary)}</strong></p>
                <p>Rem. Average Salary <strong>{getRemainingSalaryPerPlayer()}</strong></p>
              </div>
              <div className='lineup-header-info'>
                <p><strong>{teamProjectedPoints}</strong> Proj. Points</p>
                <p><strong>90%</strong> Proj. Own Sum</p>
              </div>
            </div>
          </div>
          <Lineup lineup={lineup} 
            onDelete={deleteFromLineup} 
            onAdd={editLineup}
            editingPos={editingPos}
            cancelEdit={cancelEdit} 
            onOpenDialog={openDialog}
            toggleEditingPos={toggleEditingPos}
            setPlayerDialogContent={playerWrapper} />
          <div className='lineup-btns'>
            <button className='revert-btn' onClick={revertLineup}>Revert <GrRevert/></button>
            <button className='save-btn' onClick={saveLineup}>Save</button>
            <button className='clear-btn' onClick={clearLineup}>Clear <FaTimes /></button>
          </div>
        </div>
        {draftables.length > 0 ?
          <div className='players-table-wrapper'>
            <div className='players-table-header'>
              <div className='players-table-header-upper'>
                <h2>Players</h2>
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
                <th></th>
                <th>Pos</th>
                <th>Name</th>
                <th>Salary</th>
                <th>Opponent</th>
                <th>OPRK</th>
                <th>FPPG</th>
              </thead>
              <tbody>
                {draftables.map((player, index) => 
                  (playerFilter.length < 1 || player.displayName.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
                  (editingPos == null || lineupSlots[editingPos]["allowedPositions"].includes(player.position.toLowerCase())) &&
                  (posFilter.size < 1 || posFilter.has(player.position.toLowerCase())) &&
                    <tr>
                      {canQuickAdd(player) || editingPos === player.position ?
                        <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon'/></td>
                      :
                        <td className='no-add-icon-outer'><FaPlus className='no-add-icon'/></td>
                      }
                      <td>{player.position}</td>
                      <td className='name-col'><strong className='player-name' onClick={() => playerWrapper(player)}>{player.displayName}</strong> {player.status !== "" && `(${player.status})`}</td>
                      <td>${player.salary}</td>
                      <td>{player["game"] ? player["opponent"]: ''}</td>
                      <td>{player["oprk"]}</td>
                      <td>{parseFloat(player["fppg"]).toFixed(2)}</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        : <h2>Loading Players...</h2>
        }
      </div>
    </div>
  )
}

export default CreateLineupPage