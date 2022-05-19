import { useState, useEffect } from 'react'
import './UpcomingPage.css'
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

const UpcomingPage = ({ week, year }) => {

	const [games, setGames] = useState([])

	useEffect(() => {
		getGames()
	}, [])


	const getGames = async () => {
		const res = await fetch('/upcoming', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		const games = await res.json()
		setGames(games)
	}


  return (
    <div className="upcoming-page">
    	<h2>Week {week}, {year}</h2>
			{games.length > 0 ?
				<div className="upcoming-games"> 
					<h2>Games: </h2>
					<ul className="games-list">
					{games.map((game) => 
						<li>{game}</li>
					)}
					</ul>
				</div>
			:
				<>
					<p>Loading...</p>
				</>
			}
			<p>Players: </p>

			<button>Create Lineup</button>
    </div>
  )
}

export default UpcomingPage