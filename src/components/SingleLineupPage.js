import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Players from './Players'
import Lineup from './Lineup'
import '../App.css';
import { FaAngleLeft } from 'react-icons/fa'

function SingleLineupPage() {
  const { lineupId } = useParams()
  const [players, setPlayers] = useState([])
  const [lineup, setLineup] = useState([])
  const [lineupData, setLineupData] = useState([])
  const [viewPlayers, setViewPlayers] = useState(false)
  const [editingPos, setEditingPos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewLineup, setViewLineup] = useState(true)

  // Get lineup and players on page load
  useEffect(() => {
    setLoading(true)
    getLineup()
    setEditingPos(null)
    setViewPlayers(false)
    loadLineup()
    setLoading(false)
  }, [])

  // Listens for change in position being edited
  useEffect(() => {
    setViewPlayers(true)
  }, [editingPos])

  // Fetch Players
  const fetchPlayers = async () => {
    const res = await fetch(`https://ffbapi.herokuapp.com/api/v1/top?year=${lineup.year}&week=${lineup.week}`, {
      method: 'GET',
      headers: {
        'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiJlZDg3MTJlYi03NmI5LTRlMDctODJjNS1lMTQ0Y2FjNjhlYjAifQ.P4W9vpQpXOVIRhvqBDtK42h4gx_4i5bq07geyAtWs7E'
      },
    })
    const data = await res.json()
    return data
  }

  const getPlayers = async () => {
    const playersFromServer = await fetchPlayers()
    if (playersFromServer) {
      setPlayers(playersFromServer)
    }
    else {
      setPlayers({})
    }
  }

  // Fetch user lineup
  const loadLineup = async () => {
    for (var key in lineup) {
      await players.map((player) => {
        if (key !== "week" && key !== "year" && key !== "id" && key != "user_id" 
          && lineup[`${key}`] == player.stats.id) {
            var temp = lineupData
            temp[key] = player
            setLineupData(temp)
        }
      })
    }
    setLoading(false)
  }

  const getLineup = async () => {
    const res = await fetch(`/lineups/${lineupId}`)
    const lineupFromServer = await res.json()
    setLineup(lineupFromServer)
    console.log(lineup)
    await loadLineup()
    await getPlayers()
  }

  const editLineup = async (pos) => {
    setEditingPos(pos)
  }

  // Remove a player from the users lineup
  const deleteFromLineup = async (position) => {
    const data = {}
    data[position] = null
    await fetch(`/lineups/${lineupId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application.json'
      },
      body: JSON.stringify(data)
    })
    getLineup()
  }

  const addToLineup = (id) => {
    addPlayerToLineup(id)
    setEditingPos(null)
  }

  // TODO: make it so changes arent immediately applied to database, must press save first
  // TODO: make it so that the I make a fetch call to ffbrestapi to retreive player data and load it in the app
  const addPlayerToLineup = async (id) => {
    if (editingPos) {
      var data = {}
      data[editingPos] = id
      await fetch(`/lineups/${lineupId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application.json',
        },
        body: JSON.stringify(data)
      })
    }
    getLineup()
  }

  const deleteLineup = async () => {
    await fetch(`http://localhost:3000/lineups/${lineupId}`, {
      method: 'DELETE',
    })
  }

  // Extract IDs of players in lineup for filtering purposes
  const extractIds = () => {
    const lineupIds = []
    for (const pos in lineup) {
      if (lineup[pos]) {
        lineupIds.push(lineup[pos].id)
      }
    }
    return lineupIds
  }

  // Filter players to remove players that are already in lineup or 
  // are not of the same position as the one being edited
  const filterPlayers = (players) => {
    const ids = extractIds()
    const filteredPlayers = players.filter((player) => {
      const posWithoutNumbers = editingPos.replace(/[0-9]/g, '').toUpperCase()
      return ((
        (player.position == posWithoutNumbers) || ((posWithoutNumbers === 'FLEX') && ( 
          (player.position === 'RB') || (player.position === 'WR') || (player.position === 'TE')))))
    })
    return filteredPlayers
  }

  const cancelEdit = () => {
    setViewPlayers(false) 
    setEditingPos(null)
  }

  if (!loading) { 
    return (
      <div className="main row">
        <div className="col">
          <a href="/"><FaAngleLeft />Back to Lineups</a>
          { viewLineup &&  
            <>
              <Lineup lineup={lineup} 
                onDelete={deleteFromLineup} 
                onAdd={editLineup}
                editingPos={editingPos}
                cancelEdit={cancelEdit} />
            </>
          } 
          <a className="delete-lineup-btn text-center" 
            onClick={deleteLineup} href="/">Delete Lineup</a>
        </div>
        <div className="col">
          { editingPos && 
            <>
              { players.length > 0 ? <Players 
                players={filterPlayers(players)} 
                onAdd={addToLineup} /> : 'No Players to show.' }
            </>
          }
        </div>
      </div>
    )
  } else {
    return ( 
      <h1>Loading...</h1>
    )
  }
}

export default SingleLineupPage
