import { useState, useEffect } from 'react'
import GamesSlider from '../HistoryPage/GamesSlider/GamesSlider'
import PlayersList from './PlayersList/PlayersList'
import './UpcomingPage.css'
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

const UpcomingPage = ({ week, year }) => {

	const [games, setGames] = useState([])
	const [players, setPlayers] = useState([])

	useEffect(() => {
		getGames()
		getPlayers()
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
		const res = await fetch('/players?week=18&year=2021', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		const result = await res.json()
		setPlayers(result['players'])
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
			{players['All'] && players['All'].length > 0 &&
				<PlayersList players={players} />
			}

			<button>Create Lineup</button>
    </div>
  )
}

export default UpcomingPage