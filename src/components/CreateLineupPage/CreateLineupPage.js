import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa'
import { GrRevert } from 'react-icons/gr'
import PlayerLink from './../PlayerLink/PlayerLink'
import Lineup from '../SingleLineupPage/Lineup/Lineup'
import CreateLineupDialog from '../UpcomingPage/CreateLineupDialog/CreateLineupDialog'

const CreateLineupPage = () => {

  const { draftGroupId, lineupId } = useParams()
  const [draftables, setDraftables] = useState([])
  const [activeOption, setActiveOption] = useState("custom")
  const [editingPos, setEditingPos] = useState()
  const [playerFilter, setPlayerFilter] = useState("")
  const [posFilter, setPosFilter] = useState(new Set())
  const [remainingSalary, setRemainingSalary] = useState() 
  const [prevLineup, setPrevLineup] = useState({})
  const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
  const [slate, setSlate] = useState({})

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
  }, [draftGroupId, lineupId])

  useEffect(() => {
    getRemainingSalary()
  }, [lineup])

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
      if (!mySet.has(player["playerId"])) {
        draftables.push(player)
        mySet.add(player["playerId"])
      }
    })
    setDraftables(draftables)
  }

  const getLineup = async () => {
    const res = await fetch(`/lineup_new?lineupId=${lineupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setLineup(data.lineup)
    setPrevLineup(data.lineup)
  }

  const getDraftGroup = async () => {
    const res = await fetch(`/upcoming/draftGroup?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setSlate(data["draftGroup"])
    console.log(data)
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
    const res = await fetch(`/lineups/createLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "lineup": lineup,
        "draft-group": draftGroupId
      })
    })
    .then(setPrevLineup(lineup))
    .catch((error) => {
      alert(error)
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

  const canQuickAdd = (position) => {
    for (const [k, v] of Object.entries(lineup)) {
      if ((v === null && lineupSlots[k]["allowedPositions"].includes(position.toLowerCase()))
        || (editingPos && lineupSlots[editingPos]["allowedPositions"].includes(position.toLowerCase()))) {
        return true
      }
    }
    return false
  }

  const getAttr = (draftStatAttributes, index) => {
    return draftStatAttributes.find((stat) => stat['id'] === index)["value"]
  }

  const getRemainingSalary = () => {
    var remaining = 60000
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        remaining -= lineupSlot["salary"]
      }
    }
    setRemainingSalary(remaining)
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
  }

  return (
    <div className="createLineupPage page">
      <CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
				onClose={() => setShowCreateLineupDialog(false)} slate={slate} />
      <div className="header">
        <div className="header-inner">
          <div className="header-label">
            <p className="site">Fanduel Lineup</p>
            <p className="date">9/10 - 5pm ET</p>
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
          </div>
        </div>
      </div>
      <div className='createLineupPage-inner'>
        <div className='lineup-outer'>
          <h2>Lineup</h2>
          <button onClick={() => setShowCreateLineupDialog(true)}>View All</button>
          <div className='lineup-header'>
            <div className='lineup-header-info-wrapper'>
              <div className='lineup-header-info'>
                <p>Remaining Salary <strong>{remainingSalary > 0 ? "$" + remainingSalary : "-$" + Math.abs(remainingSalary)}</strong></p>
                <p>Rem. Average Salary <strong>{getRemainingSalaryPerPlayer()}</strong></p>
              </div>
              <div className='lineup-header-info'>
                <p><strong>159.12</strong> Proj. Points</p>
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
            toggleEditingPos={toggleEditingPos} />
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
                <th>Game</th>
                <th>OPRK</th>
                <th>FPPG</th>
              </thead>
              <tbody>
                {draftables.map((player, index) => 
                  (playerFilter.length < 1 || player.displayName.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
                  (editingPos == null || lineupSlots[editingPos]["allowedPositions"].includes(player.position.toLowerCase())) &&
                  (posFilter.size < 1 || posFilter.has(player.position.toLowerCase())) &&
                    <tr>
                      {canQuickAdd(player.position) || editingPos === player.position ?
                        <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon'/></td>
                      :
                        <td className='no-add-icon-outer'><FaPlus className='no-add-icon'/></td>
                      }
                      <td>{player.position}</td>
                      <td className='name-col'><strong><PlayerLink playerName={player.displayName} /></strong> {player.status !== "None" && `(${player.status})`}</td>
                      <td>${player.salary}</td>
                      <td>{player.competition ? player.competition.name : ''}</td>
                      <td>{player.draftStatAttributes && getAttr(player.draftStatAttributes, -2)}</td>
                      <td>{player.draftStatAttributes && getAttr(player.draftStatAttributes, 90)}</td>
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