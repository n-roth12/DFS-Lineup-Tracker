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

  return (
    <div className="createLineupPage">
        {draftables.length > 0 ?
            <div>
                {draftables.map((player, index) => 
                    <LineupPlayerNew player={player} key={index} />
                )}
            </div>
        :
            <h2>Loading...</h2>
        }

    </div>
  )
}

export default CreateLineupPage