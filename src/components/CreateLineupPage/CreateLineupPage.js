import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'

const CreateLineupPage = () => {

    const { draftGroupId } = useParams()
    const [draftables, setDraftables] = useState([])

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
        setDraftables(data)
    }

  return (
    <div className="createLineupPage">
        {draftables.length > 0 ?
            <div>
                {draftables.map((player) => 
                    <LineupPlayerNew player={player} />
                )}
            </div>
        :
            <h2>Loading...</h2>
        }

    </div>
  )
}

export default CreateLineupPage