import './CompareLineupsPage.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { capitalize } from '@material-ui/core'
import { GrRevert } from 'react-icons/gr'
import { CgArrowsExchange } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'

import LineupMini from '../SingleLineupPage/Lineup/LineupMini/LineupMini'
import PlayerDialog from '../../Dialogs/PlayerDialog/PlayerDialog'
import DeleteLineupsDialog from '../../Dialogs/DeleteLineupsDialog/DeleteLineupsDialog'
import { api_url } from '../../../Constants'

const CompareLineupsPage = ({ setAlertMessage }) => {
    
  const { draftGroupId } = useParams()
  const [draftGroup, setDraftGroup] = useState()
  const [lineups, setLineups] = useState()
  const [draftables, setDraftables] = useState([])
  const [favoritePlayers, setFavoritePlayers] = useState([])
  const [isShowPercentage, setIsShowPercentage] = useState(false)
  const [swapPlayer, setSwapPlayer] = useState()
  const [playerDialogContent, setPlayerDialogContent] = useState()
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [showDeleteLineupsDialog, setShowDeleteLineupsDialog] = useState(false)
  const [editedLineups, setEditedLineups] = useState(new Set())
  const [lineupToDelete, setLineupToDelete] = useState([])

  useEffect(() => {
    getDraftGroup()
    getLineups()
    getDraftables()
  }, [])

  useEffect(() => {
    getFavPlayers()
  }, [lineups])

  const getDraftGroup = async () => {
    const res = await fetch(`${api_url}/upcoming/draftGroup?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setDraftGroup(data)
  }

  const getLineups = async () => {
    if (draftGroupId) {
      const res = await fetch(`${api_url}/users/lineups/draftGroup?draftGroup=${draftGroupId}`, {
        method: 'GET',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        }
      })
      const data = await res.json()
      var lineupData = {}
      data.forEach(lineup => {
        lineupData[lineup["lineupId"]] = lineup
      });
      setLineups(lineupData)
    }
  }

  const deleteLineup = async () => {
    const res = await fetch(`${api_url}/lineups/delete`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "lineups": [lineupToDelete["lineupId"]]
      })
    })
    setShowDeleteLineupsDialog(false)
    getLineups()
    setAlertMessage("Lineup Deleted")
  }

  const getDraftables = async () => {
    const res = await fetch(`${api_url}/upcoming/players?draftGroup=${draftGroupId}`, {
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

  const getFavPlayers = () => {
    var favPlayers = {}
    lineups && Object.values(lineups).map((lineup) => {
      for (const [k, player] of Object.entries(lineup["lineup"])) {
        if (player !== null) {
          if (favPlayers[player["playerSiteId"]]) {
            favPlayers[player["playerSiteId"]]["count"] += 1
          } else {
            favPlayers[player["playerSiteId"]] = {player, "count": 1}
          }
        }
      }
    })
    const temp = Object.values(favPlayers)
    const temp2 = temp.sort((a, b) => b["count"] - a["count"])
    setFavoritePlayers(temp2)
  }

  const createEmptyLineup = () => {
    
  }

  const toggleEditingPos = (data) => {
    setSwapPlayer(data)
  }

  const playerWrapper = (player) => {
    setPlayerDialogContent(player)
    setShowPlayerDialog(true)
  }

  const revertSingleLineup = async (lineupId) => {
    const res = await fetch(`${api_url}/lineups/lineup?lineupId=${lineupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    var lineupsCopy = {...lineups}
    lineupsCopy[lineupId] = data
    setLineups(lineupsCopy)
    editedLineups.delete(lineupId)
  }

  const revertAllLineups = async () => {
    getLineups()
    setEditedLineups(new Set())
  }

  const onSaveSingleLineup = (lineupId) => {
    editedLineups.delete(lineupId)
  }

  const addPlayerToLineup = (player, lineupId, position) => {
      var lineupsCopy = { ...lineups }
      var lineupCopy = lineupsCopy[lineupId]
      lineupCopy["lineup"][position] = player
      lineupsCopy[lineupId] = lineupCopy

      setLineups(lineupsCopy)
      setSwapPlayer()
      editedLineups.add(lineupId)
  }

  const deletePlayerFromLineup = (lineupId, position) => {
    addPlayerToLineup(null, lineupId, position)
  }

  const saveAllLineupsWrapper = () => {
    // Object.values(lineups).map((lineup) => {
    //   postLineupUpdate(lineup, draftGroup)
    // })
    setEditedLineups(new Set())
  }

  return (
    <div className='compare-lineups-page page'>
      <PlayerDialog showPlayerDialog={showPlayerDialog} 
        onClose={() => {setPlayerDialogContent({}); setShowPlayerDialog(false)}} 
        player={playerDialogContent} />
      <DeleteLineupsDialog showDeleteLineupsDialog={showDeleteLineupsDialog} 
				onClose={() => setShowDeleteLineupsDialog(false)} 
				lineupsToDelete={lineupToDelete} 
				deleteLineups={deleteLineup} />
      {draftGroup &&
      <div className='header'>
        <div className="header-inner">
          <p className='header-title'>Batch Edit Lineups</p>
          <div className='header-label'>
            <p className="site">{capitalize(draftGroup["site"])} {draftGroup["startTimeSuffix"].replace("(", " ").replace(")", "")}</p>
            <p className="date">Starts: {draftGroup["startTime"]}</p>
          </div>
        </div>
      </div>
      }
      <div className='main-wrapper'>
        <div className='lineups-wrapper-outer'>
          <div className='fav-players'>
            {Object.keys(favoritePlayers).length > 0 && favoritePlayers.map((player) => 
              <div className='fav-player'>
                <img src={player["player"]["playerImageLarge"]} />
                <div className='info'>
                  <p>{player["player"]["firstName"]}</p>
                  <p>{player["player"]["lastName"]}</p>
                  <p className='exposure-display' 
                    onClick={() => setIsShowPercentage(!isShowPercentage)}>{isShowPercentage 
                      ? `${player["count"]}/${Object.keys(lineups).length} Lineups` 
                      : `Exp: ${((player["count"] / Object.keys(lineups).length) * 100).toFixed(0)}%`}</p>
                </div>
              </div>
            )}
          </div>
          <div className='lineups-header'>
            <div className='header-inner'>
              <h2>Lineups ({lineups && Object.keys(lineups).length})</h2>
              <button className='new-lineup-btn' onClick={createEmptyLineup}>New Lineup <FaPlus className="icon" /></button>
            </div>
            <div>
              <button className={`save-all-btn${editedLineups.size > 0 ? " active" : ""}`}
                onClick={editedLineups.size > 0 ? saveAllLineupsWrapper : null}>Save All</button>
              <button className={`revert-all-btn${editedLineups.size > 0 ? " active" : ""}`}
                onClick={editedLineups.size > 0 ? revertAllLineups : null}>Revert All <GrRevert className="icon" color='white'/></button>
            </div>

          </div>
          <div className='lineups-wrapper'>
            {lineups && Object.values(lineups).map((lineup) => 
              <div>
                <LineupMini lineup={lineup}
                  toggleEditingPos={toggleEditingPos}
                  editingPos={swapPlayer} 
                  playerDialogWrapper={playerWrapper}
                  draftGroup={draftGroup}
                  setAlertMessage={setAlertMessage} 
                  onSave={onSaveSingleLineup}
                  onDelete={deletePlayerFromLineup}
                  onRevert={revertSingleLineup}
                  isEdited={editedLineups.has(lineup["lineupId"])} />
                <div className="delete-lineup-btn-wrapper">
                  <button className="delete-lineup-btn" onClick={() => {setLineupToDelete(lineup); setShowDeleteLineupsDialog(true)}}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='draftables-wrapper-outer'>
          <div className='draftables-wrapper'>
            {draftables && draftables.length &&
              <>
              <h2>Players ({draftables.length})</h2>
              <table className='lineups-table'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Pos</th>
                    <th>Name</th>
                    <th>Opponent</th>
                    <th>FPPG</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  <div className='table-inner'>
                  {draftables.map((player) =>
                    <tr>
                      <td className={`icon-wrapper${swapPlayer && 
                          swapPlayer["position"].startsWith(player["position"].toLowerCase()) ? ' active': ''}`}
                          onClick={swapPlayer && swapPlayer["position"].startsWith(player["position"].toLowerCase()) ? 
                            () => addPlayerToLineup(player, swapPlayer["lineup"], swapPlayer["position"]) : null}>
                        <CgArrowsExchange className="swap-icon" />
                      </td>
                      <td>{player["position"]}</td>
                      {player["position"] === "DST" ?
                      <td className='player-name'>{player["displayName"]}</td>
                      :
                      <td className='player-name' onClick={() => playerWrapper(player)} >{player["firstName"][0]}. {player["lastName"]}</td>
                      }
                      <td className='player-opp'>{player["game"]["awayTeam"] === player["team"] ? "@" : ""}{player["opponent"]} {player["oprk"] ? `(${player["oprk"]})` : ""}</td>
                      <td>{player["fppg"]}</td>
                      <td>${player["salary"]}</td>
                    </tr>
                  )}
                  </div>
                </tbody>
              </table>
              </>
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default CompareLineupsPage