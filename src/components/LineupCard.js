import { Link } from 'react-router-dom'
import { FaAngleRight } from 'react-icons/fa'


const LineupCard = ({ lineup }) => {
  return (
		<div className="lineup-card">
  		<h2>Week {lineup.week}, {lineup.year}</h2>
  		<hr/>
  		<ul>
  			<li>QB: {lineup.qb ? <strong>{lineup.qb.name}</strong> : <em>[empty]</em>}</li>
        <li>RB: {lineup.rb1 ? <strong>{lineup.rb1.name}</strong> : <em>[empty]</em>}</li>
        <li>RB: {lineup.rb2 ? <strong>{lineup.rb2.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr1 ? <strong>{lineup.wr1.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr2 ? <strong>{lineup.wr2.name}</strong> : <em>[empty]</em>}</li>
        <li>WR: {lineup.wr3 ? <strong>{lineup.wr3.name}</strong> : <em>[empty]</em>}</li>
        <li>TE: {lineup.te ? <strong>{lineup.te.name}</strong> : <em>[empty]</em>}</li>
        <li>FLEX: {lineup.flex ? <strong>{lineup.flex.name}</strong> : <em>[empty]</em>}</li>
  		</ul>
  		<hr/>
  		<Link to={`lineup/${lineup.id}/${lineup.week}/${lineup.year}`} 
        className="view-lineup-btn">Edit Lineup<FaAngleRight/></Link>
  	</div>
  )
}

export default LineupCard