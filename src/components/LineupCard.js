import { Link } from 'react-router-dom'
import { FaAngleRight, FaTimes } from 'react-icons/fa'


const LineupCard = ({ lineup }) => {

  const deleteLineup = async (id) => {
    await fetch(`http://localhost:3000/lineups/${id}`, {
      method: 'DELETE',
    })
  }

  return (
		<div className="lineup-card">
  		<h2>Week {lineup.week}, {lineup.year}</h2>
      <h4>Points: {lineup.points} </h4>
{/*  		<hr/>
  		<ul>
  			<li>QB: {lineup.qb ? <strong>{lineup.qb.name}</strong> : <em>[empty]</em>}</li>
        <li>RB: {lineup.rb1 ? <strong>{lineup.rb1.name}</strong> : <em>[empty]</em>}</li>
        <li>RB: {lineup.rb2 ? <strong>{lineup.rb2.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr1 ? <strong>{lineup.wr1.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr2 ? <strong>{lineup.wr2.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr3 ? <strong>{lineup.wr3.name}</strong> : <em>[empty]</em>}</li>
        <li>TE: {lineup.te ? <strong>{lineup.te.name}</strong> : <em>[empty]</em>}</li>
        <li>FLEX: {lineup.flex ? <strong>{lineup.flex.name}</strong> : <em>[empty]</em>}</li>
  		</ul>*/}
  		<hr/>
  		<Link to={`lineup/${lineup.id}/${lineup.week}/${lineup.year}`} 
        className="view-lineup-btn">View Lineup<FaAngleRight/></Link>
      <hr />
      <div>
        <a className="delete-lineup-link" href="" onClick={() => deleteLineup(lineup.id)}>Delete Lineup<FaTimes/></a>
      </div>
  	</div>
  )
}

export default LineupCard