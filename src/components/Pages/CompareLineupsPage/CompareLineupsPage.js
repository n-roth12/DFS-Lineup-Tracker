import './CompareLineupsPage.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LineupMini from '../SingleLineupPage/Lineup/LineupMini/LineupMini'

const CompareLineupsPage = () => {
    
  const { draftGroupId } = useParams()
  const [lineups, setLineups] = useState([])

  useEffect(() => {
    getLineups()
  }, [])

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

  return (
    <div className='compare-lineups-page page'>
      <div className='lineups-wrapper-outer'>
        <div className='lineups-wrapper'>
          {lineups.map((lineup) => 
            <div>
              <LineupMini className="lineup-mini" lineup={lineup["lineup"]} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompareLineupsPage