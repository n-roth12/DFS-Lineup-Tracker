import './CompareLineupsPage.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LineupMini from '../SingleLineupPage/Lineup/LineupMini/LineupMini'
import { capitalize } from '@material-ui/core'
import { GrRevert } from 'react-icons/gr'

const CompareLineupsPage = () => {
    
  const { draftGroupId } = useParams()
  const [draftGroup, setDraftGroup] = useState()
  const [lineups, setLineups] = useState([])
  const [draftables, setDraftables] = useState([])
  const [favoritePlayers, setFavoritePlayers] = useState([])
  const [changedLineups] = useState({})

  useEffect(() => {
    getDraftGroup()
    getLineups()
    getDraftables()
  }, [])

  useEffect(() => {
    getFavPlayers()
  }, [lineups])

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

  const getLineups = async () => {
    if (draftGroupId) {
      const res = await fetch(`/users/lineups/draftGroup?draftGroup=${draftGroupId}`, {
        method: 'GET',
        headers: {
          'x-access-token': sessionStorage.dfsTrackerToken
        }
      })
      const data = await res.json()
      setLineups(data)
    }
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

  const getFavPlayers = () => {
    var favPlayers = {}
    lineups.map((lineup) => {
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

  return (
    <div className='compare-lineups-page page'>
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
      {/* <div className='fav-players-wrapper'>
        <div className='fav-players'>
          {Object.keys(favoritePlayers).length > 0 && favoritePlayers.map((player) => 
            <div className='fav-player'>
              <img src={player["player"]["playerImageLarge"]} />
              <div className='info'>
                <p>{player["player"]["displayName"]}</p>
                <p>{player["count"]}/{lineups.length} ({((player["count"] / lineups.length) * 100).toFixed(2)}%)</p>
              </div>
            </div>
          )}
        </div>
      </div> */}
      <div className='main-wrapper'>
        <div className='lineups-wrapper-outer'>
          <div className='fav-players'>
            {Object.keys(favoritePlayers).length > 0 && favoritePlayers.map((player) => 
              <div className='fav-player'>
                <img src={player["player"]["playerImageLarge"]} />
                <div className='info'>
                  <p>{player["player"]["displayName"]}</p>
                  <p>{player["count"]}/{lineups.length} ({((player["count"] / lineups.length) * 100).toFixed(2)}%)</p>
                </div>
              </div>
            )}
          </div>
          <div className='lineups-header'>
            <h2>Lineups ({lineups.length})</h2>
            <button className='save-all-btn'>Save All</button>
            <button className='revert-all-btn'>Revert All <GrRevert className="icon" color='white'/></button>
          </div>
          <div className='lineups-wrapper'>
            {lineups.map((lineup) => 
              <div>
                <LineupMini lineup={lineup} />
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
                    <th>Pos</th>
                    <th>Name</th>
                    <th>Opponent</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  <div className='table-inner'>
                  {draftables.map((player) =>
                    <tr>
                      <td>{player["position"]}</td>
                      {player["position"] === "DST" ?
                      <td className='player-name'>{player["displayName"]}</td>
                      :
                      <td className='player-name'>{player["firstName"][0]}. {player["lastName"]}</td>
                      }
                      <td>{player["game"]["awayTeam"] === player["team"] ? "@" : ""}{player["opponent"]} {player["oprk"] ? `(${player["oprk"]})` : ""}</td>
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