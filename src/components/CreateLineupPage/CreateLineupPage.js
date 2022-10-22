import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'
import { FaPlus, FaSearch } from 'react-icons/fa'
import PlayerLink from './../PlayerLink/PlayerLink'
import Lineup from '../SingleLineupPage/Lineup/Lineup'

const CreateLineupPage = () => {

  const { draftGroupId } = useParams()
  const [draftables, setDraftables] = useState([])
  const [activeOption, setActiveOption] = useState("custom")
  const [editingPos, setEditingPos] = useState()
  const [playerFilter, setPlayerFilter] = useState("")
  const [allowedPositions, setAllowedPositions] = useState([])
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
    getDraftables()
  }, [])

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

  const filterPlayers = (players) => {
    const results =  players.filter((player) => {
      return (playerFilter == "" || player.name.toLowerCase().startsWith(playerFilter.toLowerCase()))
    })
  }

  const toggleEditingPos = (position) => {
    if (editingPos === position) {
      setEditingPos(null)
    } else {
      setEditingPos(position)
    }
    setAllowedPositions(lineupSlots[position]["allowedPositions"])
  }

  const deleteFromLineup = () => {
    return
  }

  const editLineup = (pos) => {
    setEditingPos(pos)
  }

  const cancelEdit = () => {
    setEditingPos(null)
  }

  const openDialog = () => {
    return
  }

  const addToLineup = (pos, player) => {
    lineup[pos] = player
    setEditingPos(null)
  }

  return (
    <div className="createLineupPage page">
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
          <div className='lineup-header'>
            <h2>Lineup</h2>
          </div>
          <Lineup lineup={lineup} 
            onDelete={deleteFromLineup} 
            onAdd={editLineup}
            editingPos={editingPos}
            cancelEdit={cancelEdit} 
            onOpenDialog={openDialog}
            toggleEditingPos={toggleEditingPos} />
        </div>
        {draftables.length > 0 ?
          <div className='players-table-wrapper'>
            <div className='players-table-header'>
              <h2>Players</h2>
              <div className="player-search">
                <div>
                  <input type="text" placeholder="Search Player" className="search-input" value={playerFilter}
                  onChange={(e) => setPlayerFilter(e.target.value)}></input>
                </div>
                <button className="search-btn" type="button"><FaSearch /></button>
              </div>
            </div>
            <table className='lineups-table'>
              <thead>
                <th></th>
                <th>Name</th>
                <th>Pos</th>
                <th>Team</th>
                <th>Salary</th>
                <th>Status</th>
              </thead>
              <tbody>
                {draftables.map((player, index) => 
                  (playerFilter.length < 1 || player.displayName.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
                  (editingPos == null || lineupSlots[editingPos]["allowedPositions"].includes(player.position.toLowerCase())) &&
                    <tr>
                      <td><FaPlus className='addIcon' onClick={() => addToLineup(editingPos, player)}/></td>
                      <td><strong><PlayerLink playerName={player.displayName} /></strong></td>
                      <td>{player.position}</td>
                      <td>{player.teamAbbreviation}</td>
                      <td>${player.salary}</td>
                      <td>{player.status}</td>
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