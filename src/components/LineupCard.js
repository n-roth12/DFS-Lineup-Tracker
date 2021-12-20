import { Link } from 'react-router-dom'
import { FaAngleRight, FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Ellipsis } from 'react-awesome-spinners'

const LineupCard = ({ lineup }) => {

  const [lineupPlayers, setLineupPlayers] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCardData(lineup)
  }, [])

  const getCardData = async () => {
    const res1 = await fetch(`lineups/${lineup['id']}`, {
      method: 'GET'
    })
    const body_data = await res1.json()
    const res2 = await fetch(`https://ffbapi.herokuapp.com/api/v1/playergamestats`, {
      method: 'POST',
      headers: {
        'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiJlZDg3MTJlYi03NmI5LTRlMDctODJjNS1lMTQ0Y2FjNjhlYjAifQ.P4W9vpQpXOVIRhvqBDtK42h4gx_4i5bq07geyAtWs7E',
        'Content-type': 'application.json'
      },
      body: JSON.stringify(body_data)
    })
    const b = await res2.json()
    await setLineupPlayers(b)
    setLoading(false)
  }

  const deleteLineup = async (id) => {
    await fetch(`http://localhost:3000/lineups/${id}`, {
      method: 'DELETE',
    })
  }

  return (
		<div className="lineup-card">
  		<h2>Week {lineup.week}, {lineup.year}</h2>
      <h4>{lineup.points} PTS</h4>
      <h4>{`${lineup.bet > lineup.winnings ? "-" : "+"}\$${lineup.winnings - lineup.bet}`}</h4>
  		<hr/>
      {!loading ?
        <>
    			<li>QB: {lineupPlayers.qb ? <strong>{lineupPlayers.qb.name}</strong> : <em>________</em>}</li>
          <li>RB: {lineupPlayers.rb1 ? <strong>{lineupPlayers.rb1.name}</strong> : <em>________</em>}</li>
          <li>RB: {lineupPlayers.rb2 ? <strong>{lineupPlayers.rb2.name}</strong> : <em>________</em>}</li>
          <li>WR: {lineupPlayers.wr1 ? <strong>{lineupPlayers.wr1.name}</strong> : <em>________</em>}</li>
          <li>WR: {lineupPlayers.wr2 ? <strong>{lineupPlayers.wr2.name}</strong> : <em>________</em>}</li>
          <li>WR: {lineupPlayers.wr3 ? <strong>{lineupPlayers.wr3.name}</strong> : <em>________</em>}</li>
          <li>TE: {lineupPlayers.te ? <strong>{lineupPlayers.te.name}</strong> : <em>________</em>}</li>
          <li>FLEX: {lineupPlayers.flex ? <strong>{lineupPlayers.flex.name}</strong> : <em>________</em>}</li>
        </> : 
        <>
          <div>
            <Ellipsis />
          </div>
        </>
      }
      <hr/>
  		<Link to={`lineup/${lineup.id}/${lineup.week}/${lineup.year}`} 
        className="view-lineup-btn">Edit Lineup<FaAngleRight/></Link>
      <hr />
      <div>
        <a className="delete-lineup-link" href="" onClick={() => deleteLineup(lineup.id)}>Delete Lineup<FaTimes/></a>
      </div>
  	</div>
  )
}

export default LineupCard