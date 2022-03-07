import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Players from './Players'
import Lineup from './Lineup'
import EditWagerForm from './EditWagerForm'
import { FaAngleLeft } from 'react-icons/fa'
import { Roller } from 'react-awesome-spinners'
import '../App.css';

function SingleLineupPage() {
  const { lineupId, lineupWeek, lineupYear } = useParams()
  const [players, setPlayers] = useState([])
  const [prevLineup, setPrevLineup] = useState()
  const [lineup, setLineup] = useState()
  const [lineupData, setLineupData] = useState()
  const [viewPlayers, setViewPlayers] = useState(true)
  const [editingPos, setEditingPos] = useState(null)
  const [loading, setLoading] = useState("Loading")
  const [viewLineup, setViewLineup] = useState(true)
  const [lineupScore, setLineupScore] = useState(0)
  const [viewSaveLineup, setViewSaveLineup] = useState(false)

  // Get lineup and players on page load
  useEffect(() => {
    setLoading("Loading Lineup Data...")
    loadPage()
  }, [])

  useEffect(() => {
    getLineupData()
  }, [lineup])

  useEffect(() => {
    getLineupScore()
  }, [lineupData])

  // Listens for change in position being edited
  useEffect(() => {
    setViewPlayers(true)
  }, [editingPos])


  const loadPage = async () => {
    await getPlayers()
    await getLineup()
    await getLineupData()
    setLoading(null)
  }

  // Fetch Players
  const fetchPlayers = async () => {
    const res = await fetch(`/players?year=${lineupYear}&week=${lineupWeek}`, {
      method: 'GET'
    })
    const data = await res.json()
    return data['players']
  }

  const getPlayers = async () => {
    const playersFromServer = await fetchPlayers()
    if (playersFromServer) {
      setPlayers(playersFromServer)
    }
  }

  // Fetch user lineup
  const getLineupData = () => {
    if (lineup != null) {
      var temp = {...lineupData}
      var scoreSum = 0
      for (var key in lineup) {
        if (lineup[key] == null) {
          temp[`${key}`] = null
        } else {
          players.map((player) => {
            if (key !== "week" && key !== "year" && key !== "id" && key != "user_id" && key != 'points' && key != 'fantasy_points' && key != 'winnings' && key != 'bet'
              && lineup[`${key}`] == player.stats.id) {
                temp[`${key}`] = player
            }
          })
        }
      }
      setLineupData(temp)
    }
  }

  const getLineupScore = () => {
    var scoreSum = 0
    if (lineup != null) {
      Object.values(lineupData).map((player) => {
        if (!(player == null || player.name == null)) {
          scoreSum += player.stats.fantasy_points
        }
      })
    }
    const roundScore = Math.round((scoreSum + Number.EPSILON) * 100) / 100
    setLineupScore(roundScore)
  }

  const getLineup = async () => {
    const res = await fetch(`/lineups/${lineupId}`)
    const lineupFromServer = await res.json()
    const temp = await {...lineupFromServer}
    await setLineup(temp)
    await setPrevLineup(temp)
  }

  const editLineup = async (pos) => {
    setEditingPos(pos)
  }

  // Remove a player from the users lineup
  const deleteFromLineup = async (position) => {
    const temp = {...lineup}
    temp[`${position}`] = null
    await setLineup(temp)
    setViewSaveLineup(true)
  }

  const addToLineup = async (id) => {
    addPlayerToLineup(id)
    setEditingPos(null)
    setViewSaveLineup(true)
  }

  const addPlayerToLineup = async (id) => {
    if (editingPos) {
      var temp = {...lineup}
      temp[editingPos] = id
      setLineup(temp)
    }
  }

  const deleteLineup = async () => {
    await fetch(`http://localhost:3000/lineups/${lineupId}`, {
      method: 'DELETE',
    })
  }

  const saveLineup = async () => {
    setViewSaveLineup(false)
    var temp = {...lineup}
    temp.points = lineupScore
    await fetch(`/lineups/${lineupId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application.json',
      },
      body: JSON.stringify(temp)
    })
    await setPrevLineup(lineup)

  }

  // Extract IDs of players in lineup for filtering purposes
  const extractIds = () => {
    var lineupIds = []
    for (const key in lineup) {
      if (lineup[`${key}`] && key != 'id' && key != 'week' && key != 'year' && key != 'user_id' && key != 'points') {
        lineupIds.push(lineup[`${key}`])
      }
    }
    return lineupIds
  }

  // Filter players to remove players that are already in lineup or 
  // are not of the same position as the one being edited
  const filterPlayers = (players) => {
    const ids = extractIds()
    if (!editingPos) {
      return players
    }
    const filteredPlayers = players.filter((player) => {
      const posWithoutNumbers = editingPos.replace(/[0-9]/g, '').toUpperCase()
      return (
        ((player.position == posWithoutNumbers) || ((posWithoutNumbers === 'FLEX') && ( 
          (player.position === 'RB') || (player.position === 'WR') || (player.position === 'TE'))))
        && (!ids.includes(player.stats.id))
        )
    })
    return filteredPlayers
  }

  const cancelChanges = async () => {
    setViewSaveLineup(false)
    setLineup(prevLineup)
    setEditingPos(null)
    setViewPlayers(false)

  }

  const cancelEdit = () => {
    setViewPlayers(false) 
    setEditingPos(null)
  }

  if (!loading) { 
    return (
      <div className="main row container-fluid">
        <div className="row header">
          <div className="col-2 back-btn-wrapper">
            <a className="back-btn" href="/"><FaAngleLeft />Back to Lineups</a>
          </div>
          <div className="col-5">
            <h1>Fanduel Lineup: {lineupYear}, Week {lineupWeek}</h1>
          </div>
          <div className="col-5">
            <EditWagerForm lineup={lineup} />
          </div>
          </div>
        <div className="col-12 col-md-6 col-lg-5">
          <div className="lineup-wrapper">
            <h1>Your Lineup</h1>
            <h2>Point Total: {lineupScore}</h2>
            <h2>Return: {lineup.winnings - lineup.bet}</h2>
            { viewSaveLineup && 
              <>
                <button className="view-players-btn"
                  onClick={saveLineup}>Save Changes</button>
                <button className="delete-lineup-btn"
                  onClick={cancelChanges}>Cancel Changes</button>
              </>
            }
            { viewLineup &&  
              <>
                <Lineup lineup={lineupData} 
                  onDelete={deleteFromLineup} 
                  onAdd={editLineup}
                  editingPos={editingPos}
                  cancelEdit={cancelEdit} 
                  lineupWeek={lineupWeek}
                  lineupYear={lineupYear}
                  lineupScore={lineupScore}/>
              </>
            }
            <br /> 
            <a className="delete-lineup-btn text-center" 
              onClick={deleteLineup} href="/">Delete Lineup</a>
            </div>
        </div>
        <div className="col-12 col-md-6 col-lg-5">
          <div className="players-wrapper">
            { editingPos && 
              <>
                <h1>Available {editingPos !== null ? editingPos.replace(/[0-9]/g, '').toUpperCase() : 'Players'}</h1>
                { players.length > 0 ? <Players 
                  players={filterPlayers(players)} 
                  onAdd={addToLineup} /> : 'No Players to show.' }
              </>
            }
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <h1>{loading}</h1>
        <div className="ring">
          <Roller />
        </div>
      </>
    )
  }
}

export default SingleLineupPage
