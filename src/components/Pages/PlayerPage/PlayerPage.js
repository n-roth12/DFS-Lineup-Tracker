import './PlayerPage.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PlayerSearch from '../HistoryPage/PlayerSearch/PlayerSearch'
import { api_url } from '../../../Constants'

const PlayerPage = () => {

  const { name } = useParams()
  const [playerName, setPlayerName] = useState(name.replace('_', ' '))
  const [playerData, setPlayerData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlayerData(playerName)
  }, [])

  const getPlayerData = async (name) => {
    const res = await fetch(`${api_url}/history/player?name=${name}`, {
      method: "GET",
      headers: {
        "x-access-token": sessionStorage.dfsTrackerToken
      }
    })
    if (res.status === 200) {
      setPlayerData(await res.json())
    } else {
      setPlayerData({"error": "No Player Found"})
    }
    setLoading(false)
  }

  return (
    <div className="player-page page">
      {loading ?
        <h1>Loading...</h1>
      :
        <PlayerSearch playerSearchData={playerData} />
      }
    </div>
  )
}

export default PlayerPage