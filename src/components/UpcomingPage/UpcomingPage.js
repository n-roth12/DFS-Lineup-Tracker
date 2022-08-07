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
		// getGames()
		getPlayers()
		getScoreboard()
	}, [])


	// const getGames = async () => {
	// 	const res = await fetch('/upcoming/games', {
	// 		method: 'GET',
	// 		headers: {
	// 			'x-access-token': sessionStorage.dfsTrackerToken
	// 		}
	// 	})
	// 	const result = await res.json()
	// 	var games_data = []
	// 	result["games"].map((game) => {
	// 		games_data.push(
	// 			{
	// 				"game": `${game["away_team"]}@${game["home_team"]}`,
	// 				"away": game["away_team"],
	// 				"home": game["home_team"],

	// 			})
	// 	})
	// 	setGames(games_data)
	// }

	const getScoreboard = async () => {
		// url for current week scoreboard
		// const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York"
		// use seasonType = 1 for preseason, seasonType = 2 for regular season
		// const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York&seasontype=1&weeks=3&dates=2022"
		const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York&seasontype=2&weeks=3&dates=2022"
		const res = await fetch(url)
		const data = await res.json()
		setGames(data["sports"][0]["leagues"][0]["events"])
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
			{games.length &&
				<h2>
					{games[0]["group"]["name"]} - Week {games[0]["week"]}
				</h2>
			}
			{/* {games.length > 0 &&
				<GamesSlider
					games={games}
					selectedWeek={week}
					selectedYear={year} />
			} */}
			{games.map((game) => (
				<div className="game-block">
					<span>
						<span>{game["summary"]} - {game["fullStatus"]["displayClock"]}</span>
					</span>
					<span>
						<span>{game["competitors"][0]["abbreviation"]} - {game["competitors"][0]["score"]}</span>
					</span>
					<span>
						<span>{game["competitors"][1]["abbreviation"]} - {game["competitors"][1]["score"]}</span>
					</span>
				</div>
			))}
			{players['All'] && players['All'].length > 0 &&
				<PlayersList players={players} />
			}

			<button>Create Lineup</button>
		</div>
	)
}

export default UpcomingPage