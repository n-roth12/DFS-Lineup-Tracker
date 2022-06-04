import { useState, useEffect } from 'react'
import GamesSlider from '../ResearchPage/GamesSlider/GamesSlider'
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
		const res = await fetch('/upcoming/games', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		const result = await res.json()
    var games_data = []
    result["games"].map((game) => {
      games_data.push(
      {
      	"game": `${game["away_team"]}@${game["home_team"]}`,
        "away": game["away_team"],
        "home": game["home_team"],

      })
    })
    setGames(games_data)
	}

	const getPlayers = async () => {
		return
	}


  return (
    <div className="upcoming-page">
    	<h2>Week {week}, {year}</h2>
    	{games.length > 0 &&
    	  <GamesSlider 
          games={games} 
          selectedWeek={week} 
          selectedYear={year} />
    	}
			<p>Players: </p>

			<button>Create Lineup</button>
    </div>
  )
}

export default UpcomingPage