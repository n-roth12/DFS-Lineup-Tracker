import { useState, useEffect } from 'react'
import GamesSlider from '../HistoryPage/GamesSlider/GamesSlider'
import PlayersList from './PlayersList/PlayersList'
import './UpcomingPage.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'

const UpcomingPage = ({ week, year }) => {

	const [games, setGames] = useState([])
	const [slates, setSlates] = useState([])
	const [players, setPlayers] = useState([])
	const [activeSlate, setActiveSlate] = useState()

	useEffect(() => {
		getScoreboard()
		getUpcomingSlates()
	}, [])

	useEffect(() => {
		const slateMatchingId = slates.find((slate) => {
			return String(slate["draftGroup"]["draftGroupId"]) === activeSlate
		})
		if (slateMatchingId) {
			setPlayers(slateMatchingId["draftables"])
		}
	}, [activeSlate])

	const getUpcomingSlates = async () => {
		const res = await fetch('/upcoming/slates', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})

		const data = await res.json()
		setSlates(data)
		setActiveSlate(data[0]["draftGroup"]["draftGroupId"])
	}

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

	// const getSlates = async () => {
	// 	const url = "https://www.draftkings.com/lineup/getupcomingcontestinfo"
	// 	const res = await fetch(`${url}`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'origin': "https://www.draftkings.com"
	// 		}
	// 	})
	// 	const contests = await res.json()
	// 	const nflContests = contests.filter((contest) => {
	// 		return contest["Sport"] === "NFL"
	// 	})
	// 	setContests(nflContests)
		
	// }

	// const getUpcomingSlates = async () => {
	// 	const url = "https://www.draftkings.com/lobby/getcontests?sport=nfl"
	// 	const res = await fetch(url)
	// 	const data = res.json()
	// 	console.log(data["Contests"].length)
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

	const getFanduelPlayers = async () => {

		const res = await fetch("https://api.fanduel.com/fixture-lists/78816/players?content_sources=NUMBERFIRE,ROTOWIRE,ROTOGRINDERS", {
			headers: {
				"authority": "api.fanduel.com",
				"method": "GET",
				"path": "/fixture-lists/78816/players?content_sources=NUMBERFIRE,ROTOWIRE,ROTOGRINDERS",
				"scheme": "https",
				"accept": "application/json",
				"accept-encoding": "gzip, deflate, br",
				"accept-language": "en-US,en;q=0.9",
				"authorization": "Basic ZWFmNzdmMTI3ZWEwMDNkNGUyNzVhM2VkMDdkNmY1Mjc6",
				"origin": "https://www.fanduel.com",
				"referer": "https://www.fanduel.com/",
				"sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "macOS",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-site",
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
				"x-auth-token": "eyJraWQiOiIxIiwiYWxnIjoiUlMyNTYifQ.eyJzZXMiOjE1NzIxODMzNDcsInN1YiI6OTI3Mzc0NSwidXNuIjoibnJhd3RoMTIiLCJwcmQiOiJERlMiLCJjcnQiOjE2NjAwMDA0MDAsImVtbCI6Im5vbGFucnJvdGgxMkBnbWFpbC5jb20iLCJzcmMiOjQsInJscyI6WzFdLCJtZmEiOmZhbHNlLCJ0eXAiOjEsImV4cCI6MTY2MDA0MzYwMH0.BVTqDwOyvTUg_2LxzA_581lpQZURx0QiaffQ6oQHvxDrwgB7EVBCRcfH9_MSCDd-YYBkNazjnl49siSIC9SL7WUpzPPDEPyT8ALJY3SQIasaau0nC8fFqHddgoqzcHNYciyW4twIlbG9QzV81iyfJ5Xnhbz_sN-sUfFqovqWATGShN3az834eHkXi_rNGYJRcTIJBmReezQuD6c806MEiXS1h9hPSDbfeEAhEkpYtl0lE0OSNCItpTAKbsfWi3UQ1Fp8q-hoGt0oNodBHEoBvIV52aEUpHKECqnt8jcNXLeNKRZy_z6tfPXEuJjcLJlNub1ljxs8QS0EAuVNekh92A",
				"x-brand": "FANDUEL",
				"x-currency": "USD",
				"x-geo-packet": "eyJhbGciOiJSUzI1NiJ9.eyJzdGF0ZSI6Ik5KIiwicHJvZHVjdCI6IkRGUyIsImdjX3RyYW5zYWN0aW9uX2lkIjoiNjRkMTE0M2IxZDFiNmZlYSIsInRpbWVzdGFtcCI6IjIwMjItMDgtMDhUMjM6MTM6MjguMTYxWiIsInVzZXJfaWQiOiI5MjczNzQ1IiwicmVzdWx0IjpmYWxzZSwiZXJyb3JfbWVzc2FnZSI6InNwb29maW5nX2RldGVjdGlvbiIsInRyb3VibGVzaG9vdGVyIjpbeyJtZXNzYWdlIjoiV2UgbmVlZCB0byBjb25maXJtIHlvdSdyZSBpbiBhbiBhcmVhIHdoZXJlIGl0J3MgbGVnYWwgdG8gcGxheSBpbiBwYWlkIGNvbnRlc3RzLiBQbGVhc2UgZGlzYWJsZSBicm93c2VyIGV4dGVuc2lvbnMgb3Igb3RoZXIgYXBwcyB0aGF0IG1pZ2h0IG9ic2N1cmUgeW91ciBsb2NhdGlvbi4iLCJydWxlIjoic3Bvb2ZpbmdfZGV0ZWN0aW9uIiwicmV0cnkiOnRydWV9XSwiaXBfYWRkcmVzcyI6Ijk5LjAuODIuMTM4Iiwic2Vzc2lvbl9pZCI6MTU3MjE4MzM0NywiY291bnRyeV9jb2RlIjoiVVMiLCJyZWdpb25fY29kZSI6IkNBIn0.BlbV1adrJSZ1lShnAHFwhWYvZP0wBIC1b0YAWGh8eAUtkluUI0tUy-bMaCPlcAxjvlrH0CR1V6WJQrrlz85ncruJnX9795WEbtrDF-PRFR3pVwv7i0F6a8XmbPo9ThJtZj_NUGl_Lp-qeD8p3TOylJ_CEtFU_u5PiLMqo0VLTaAyQyqlRdYkn8zt-s45d6L5Pt5dt3Prz8I-edTNKrqSZJPI48b6RnTkesO-OwK2w7FV2Du3XhcFzxFuatwfOsUrwqKbAo5TPZb8eh9njcUmcVIRnrSi111_BOgTeI6swhlXszPXUJzIt6mKNB73LkYPx9nNor_MQkPY3BGUhpog7A",
				"x-px-context": "_px3=9b32f0c31b8a53d591554b26deaad6224fb05b892bd7dfdd8f721522914b633a:V8YrSa73/NoD/JiwbF8ebvm43bfQhhVhTcXUXajj2HlPom1zkZhmY27tu+HNmjeAVAI2oDVjEB+ORvasoiyXnA==:1000:UU+v4mAmR+f8W6WDNo5Forj8RVKjf9yfpVqXmfPifOqXd5x0Wk3CJNevtwtoPyazRXZBHMzBrv0Dm+7Qk4Pcrfvl4TmmRvwS9UMuh30E55zm7AcbX5J7r4V/ZVP3InKU00BQx0teYdFU733gApu3edrnOWUfJyvaQhe28AVOofi3uVz183yRBxqL3ClicwYy9hAt8HZLRfhi/YnTjFH1tg==;_pxvid=9c09f95c-176f-11ed-99ff-4c4254494865;pxcts=9c0a0710-176f-11ed-99ff-4c4254494865"
			}
		})
		const players = await res.json()
		console.log(players)

	}

	// const getPlayers = async () => {
	// 	const res = await fetch('/players?week=18&year=2021', {
	// 		method: 'GET',
	// 		headers: {
	// 			'x-access-token': sessionStorage.dfsTrackerToken
	// 		}
	// 	})
	// 	const result = await res.json()
	// 	setPlayers(result['players'])
	// }


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
			{games.length > 0 && 
				<div className='games-outer' >
					<h2>Games</h2>
					<div className="games-inner">
						{games.map((game) => (
							<div className="game-block">
								<span>
									<span>{game["summary"]} - {game["fullStatus"]["displayClock"]}</span>
								</span>
								<span>
									<span><img src={game["competitors"][0]["logo"]} />{game["competitors"][0]["abbreviation"]} - {game["competitors"][0]["score"]}</span>
								</span>
								<span>
									<span><img src={game["competitors"][1]["logo"]} />{game["competitors"][1]["abbreviation"]} - {game["competitors"][1]["score"]}</span>
								</span>
							</div>
						))}
					</div>
				</div>
			}
			{/* {players['All'] && players['All'].length > 0 &&
				<PlayersList players={players} />
			} */}
			<select value={activeSlate} onChange={(e) => setActiveSlate(e.target.value)}>
				{slates.length > 0 && slates.map((slate) => (
					<option 
						value={slate["draftGroup"]["draftGroupId"]}
						key={slate["draftGroup"]["draftGroupId"]}>
						{slate["draftGroup"]["minStartTime"]} ({slate["draftGroup"]["games"].length} games)
					</option>
				))}
			</select>
			<Link className="search-btn" to={`/`}>Create Lineup</Link>
			{players.length > 0 &&
				<div>
					{players.map((player) => (
						<PlayerNew player={player} />
					))}
				</div>	
			}


			{players.length > 0 && 
				<div className='players-outer'>
					<h2>Players</h2>
					<div className='players-inner'>
						<table className='lineups-table'>
							<thead>
								{/* <th></th> */}
								<th>Name</th>
								<th>Pos</th>
								<th>Game</th>
								<th>FPPG</th>
								<th>OPRK</th>
								<th>DK Salary</th>
							</thead>
							<tbody>
								{players.map((player) => (
									<tr>
										{/* <td><img src={player['playerImage50']}/></td> */}
										<td><strong>{player['firstName']} {player['lastName']}</strong> ({player['teamAbbreviation']})</td>
										<td>{player['position']}</td>
										<td>{player['competition']['name']}</td>
										<td>{player['draftStatAttributes'][0]['value']}</td>
										<td>{player['draftStatAttributes'][1]['value']}</td>
										<td>${player['salary']} ({player['salary']/50000})</td>
									</tr>
								))}
								<tr></tr>
							</tbody>
						</table>
					</div>
				</div>
			}
		</div>
	)
}

export default UpcomingPage