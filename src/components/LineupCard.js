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
    const res = await fetch(`/lineup_data/${lineup['id']}`)
    const b = await res.json()
    await setLineupPlayers(b['lineup_data'])
    setLoading(false)
  }

  const deleteLineup = async (id) => {
    await fetch(`http://localhost:3000/lineups/${id}`, {
      method: 'DELETE',
    })
  }

  return (
    <Link to={`lineup/${lineup.id}/${lineup.week}/${lineup.year}`}>
  		<div className="lineup-card">
    		<h2>Week {lineup.week}, {lineup.year}</h2>
        <h4>{lineup.points} PTS</h4>
        <h4>{`${lineup.bet > lineup.winnings ? "-" : "+"}\$${Math.abs(lineup.winnings - lineup.bet)}`}</h4>
    		<hr/>
        {!loading ?
          <>
      			<li>QB: {lineupPlayers.qb ? <strong>{lineupPlayers.qb.name}</strong>: <em>________</em>}</li>
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
    </Link>
  )
}

export default LineupCard