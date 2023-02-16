import { useState, useEffect } from 'react'
import './UpcomingPage.scss'
import '../../../DefaultTable.scss'
import PlayerLink from '../../Buttons/PlayerLink/PlayerLink';
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog';
import { Roller } from 'react-awesome-spinners';
import { FaAngleRight, FaPlus } from 'react-icons/fa';
import { BiImport } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '@material-ui/core';
import { FaSearch } from 'react-icons/fa';

const UpcomingPage = ({ week, year }) => {

	const [slates, setSlates] = useState([])
	const [players, setPlayers] = useState([])
	const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
	const [createLineupDialogContent, setCreateLineupDialogContent] = useState({})
	const [sortColumn, setSortColumn] = useState(["draftkings", "salary"])
	const [isSortUp, setIsSortUp] = useState(false)
	const [selectedSite, setSelectedSite] = useState("draftkings")
	const [lastUpdate, setLastUpdate] = useState("")
	const [activeSlate, setActiveSlate] = useState({})
	const [activeSlateDraftables, setActiveSlateDraftales] = useState([])
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [loadingDraftables, setLoadingDraftables] = useState(false)
	const [posFilter, setPosFilter] = useState(new Set())
	const [playerFilter, setPlayerFilter] = useState("")
	const navigate = useNavigate()
 
	useEffect(() => {
		getPlayers()
		getUpcomingSlates()
	}, [])

	useEffect(() => {
		getDraftables()
	}, [activeSlate])

	useEffect(() => {
		if (slates.length > 0) {
			setActiveSlate(slates.filter((slate) => slate["site"] === selectedSite)[0])
		}
	}, [selectedSite])

	const getUpcomingSlates = async () => {
		const res = await fetch('/upcoming/slates_new', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		const data = await res.json()

		setSlates(data)
		setActiveSlate(data.find((slate) => slate["site"] === selectedSite))
	}

	const getDraftables = async () => {
		if (activeSlate && activeSlate["draftGroupId"] != null && selectedSite) {
			setLoadingDraftables(true)
			const res = await fetch(`/upcoming/draftables?draftGroupId=${activeSlate["draftGroupId"]}&site=${selectedSite}`, {
				method: 'GET',
				headers: {
					'x-access-token': sessionStorage.dfsTrackerToken
				}
			})
			const data = await res.json()
			setActiveSlateDraftales(data)
			setLoadingDraftables(false)
		}
	}

	const dialogActionWrapper = (slate) => {
		setCreateLineupDialogContent(slate)
		setShowCreateLineupDialog(true)
	}

	const closeDialogWrapper = () => {
		setShowCreateLineupDialog(false)
		setCreateLineupDialogContent({})
	}

	const getPlayers = async () => {
		const res = await fetch('/upcoming/ownership', {
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		const result = await res.json()
		setPlayers(result["players"])
		setLastUpdate(result["last-update"])
	}

	const sortRows = (site, attribute) => {
		if (attribute === "name") {
			setPlayers([...players].sort((a, b) => a[attribute] >= b[attribute] ? (isSortUp ? 1 : -1) : (isSortUp ? -1 : 1)))
		} else {
			setPlayers([...players].sort((a, b) => 
				(a["stats"][site] && b["stats"][site] && a["stats"][site][attribute] >= b["stats"][site][attribute]) || !b["stats"][site] 
					? (isSortUp ? 1 : -1) 
					: (isSortUp ? -1 : 1)))
		}
		setIsSortUp(!isSortUp)
		setSortColumn([site, attribute])
	}

	const createLineup = async (draftGroup) => {
		const res = await fetch(`/lineups/createEmptyLineup`, {
			method: 'POST',
			headers: {
			  'x-access-token': sessionStorage.dfsTrackerToken
			},
			body: JSON.stringify({
			  "draftGroupId": draftGroup["draftGroupId"],
			  "startTime": draftGroup["startTime"],
			  "endTime": draftGroup["endTime"],
			  "site": draftGroup["site"],
			  "startTimeSuffix": draftGroup["startTimeSuffix"],
			  "salaryCap": draftGroup["salaryCap"]
			})
		})
		const data = await res.json()
		const lineupId = data["lineupId"]
		navigate(`/createLineup/${draftGroup["draftGroupId"]}/${lineupId}`)
	}

	const togglePosFilter = (position) => {
		if (posFilter.has(position)) {
		  const filterCopy = new Set(posFilter)
		  filterCopy.delete(position)
		  setPosFilter(filterCopy)
		} else {
		  setPosFilter(new Set(posFilter.add(position)))
		}
	  }

	return (
		<div className="upcoming-page page">
			<CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
				onClose={closeDialogWrapper} draftGroup={createLineupDialogContent} />
			<div className='site-filter-wrapper'>
				<div className='site-filter-wrapper-inner'>
					<button className={`underline-btn${selectedSite === "draftkings" ? " active": ""}`}
						onClick={() => setSelectedSite("draftkings")}>DraftKings</button>
					<button className={`underline-btn${selectedSite === "yahoo" ? " active" : ""}`}
						onClick={() => setSelectedSite("yahoo")}>Yahoo</button>
					<button className={`underline-btn${selectedSite === "fanduel" ? " active" : ""}`}
						onClick={() => setSelectedSite("fanduel")}>Fanduel</button>
				</div>
			</div>
			<div className='slatesWrapper-outer'>
				{slates.length && activeSlate ?
					<>
					<div className="slatesWrapper">
						{slates.length > 0 ? slates.map((slate) => (
							slate["site"] === selectedSite &&
							<div className={`slate${activeSlate["draftGroupId"] == slate["draftGroupId"] ? " active" : ""}`} onClick={() => setActiveSlate(slate)}>
								{/* <p>{slate["minStartTime"].split("T")[0]}</p> */}
								<p>{slate["startTimeSuffix"] ? slate["startTimeSuffix"].replace(")", "").replace("(", "") : "Main"}</p>
								<p>{slate["games"].length} Games</p>
								{/* <p>{slate["minStartTime"].split("T")[1]}</p> */}
								<p onClick={(e) => {e.stopPropagation(); dialogActionWrapper(slate)}} className='link-btn'>Details <FaAngleRight /></p>
							</div>
						))
						:
						<h3>No Slates Found</h3>
					}
					</div>
				</>
				:
					<div className='loading-screen'>
						<h3><Roller /></h3>
					</div>
				}
			</div>

			{!loadingDraftables ? <>
			{activeSlate && Object.keys(activeSlateDraftables).length > 0 && 
				<div className='players-outer'>
					<div className='players-outer-header'>
					<div className='btn-wrapper'>
							<button className='lineup-options-btn' onClick={() => createLineup(activeSlate)}>Create Lineup <FaPlus className='icon'/></button>
							<button className='lineup-options-btn' onClick={() => setShowImportDialog(true)}>Import <BiImport className='icon'/></button>
						</div>
					<h2><span>{capitalize(selectedSite)}</span> <span className='slate-title'>{activeSlate["startTimeSuffix"] ? activeSlate["startTimeSuffix"] : "(Main)"}</span></h2>
					</div>
					<div className='filters-outer'>
						<div className="pos-filter-wrapper">
							<div>
								<button 
									className={`filter-btn${posFilter.size < 1 ? "-active" : ""}`} 
									onClick={() => setPosFilter(new Set())}>All
								</button>
								<button 
									className={`filter-btn${posFilter.has("qb") ? "-active" : ""}`} 
									onClick={() => togglePosFilter("qb")}>QB
								</button>
								<button 
									className={`filter-btn${posFilter.has("rb") ? "-active" : ""}`} 
									onClick={() => togglePosFilter("rb")}>RB
								</button>
								<button 
									className={`filter-btn${posFilter.has("wr") ? "-active" : ""}`} 
									onClick={() => togglePosFilter("wr")}>WR
								</button>
								<button 
									className={`filter-btn${posFilter.has("te") ? "-active" : ""}`} 
									onClick={() => togglePosFilter("te")}>TE
								</button>
								<button
									className={`filter-btn${posFilter.has("dst") ? "-active" : ""}`} 
									onClick={() => togglePosFilter("dst")}>DST
								</button>
							</div>
						</div>
						<div className="player-search">
							<input type="text" placeholder="Search Player" className="search-input" value={playerFilter}
								onChange={(e) => setPlayerFilter(e.target.value)}></input>
							<button className="search-btn" type="button"><FaSearch /></button>

					</div>
					</div>
					<div className='players-inner'>
						<table className='lineups-table'>
							<thead>
								{/* <tr className="col-labels">
									<th colspan="4"></th>
									<th className="col-label" colspan="2">Fanduel</th>
									<th className="col-label" colspan="2">Draftkings</th>
								</tr> */}
								<tr className='header-labels'>
									<th className={sortColumn[1] === "name" ? "selected": ""}
										onClick={() => sortRows("", "name")}>Name</th>
									<th className={sortColumn[1] === "position" ? "selected": ""}
										onClick={() => sortRows("fanduel", "position")}>Pos</th>
									{/* <th className={sortColumn[1] === "team" && "selected"}
										onClick={() => sortRows("fanduel" , "team")}>Team</th> */}
									<th className={sortColumn[1] == "opponent" ? "selected": ""}
										onClick={() => sortRows("fanduel", "opponent")}>Opp</th>
									<th className={sortColumn[0] === "fanduel" && sortColumn[1] === "salary" ? "selected": ""}
										onClick={() => sortRows("fanduel", "salary")}>Salary</th>
									<th className={sortColumn[0] === "fanduel" && sortColumn[1] === "ownership_projection" ? "selected": ""}
										onClick={() => sortRows("fanduel", "ownership_projection")}>FPPG</th>
									{/* <th className={sortColumn[0] === "draftkings" && sortColumn[1] === "salary" && "selected"}
										onClick={() => sortRows("draftkings", "salary")}>Salary</th>
									<th className={sortColumn[0] === "draftkings" && sortColumn[1] == "ownership_projection" && "selected"}
										onClick={() => sortRows("draftkings", "ownership_projection")}>Own Proj</th> */}
								</tr>
							</thead>
							<tbody>
								{activeSlateDraftables.map((data) => (
									(playerFilter.length < 1 || data["displayName"].toLowerCase().startsWith(playerFilter.toLowerCase())) &&
									(posFilter.size < 1 || posFilter.has(data.position.toLowerCase())) &&
									// <tr>
									// 	<td><strong><PlayerLink playerName={data["name"]} /></strong></td>
									// 	<td>{data["stats"]["fanduel"] ? data["stats"]["fanduel"]["position"] : data["stats"]["draftkings"]["position"] }</td>
									// 	<td>{data["stats"]["fanduel"] ? data["stats"]["fanduel"]["team"] : data["stats"]["draftkings"]["team"]}</td>
									// 	<td>{data["stats"]["fanduel"] ? data["stats"]["fanduel"]["opponent"] : data["stats"]["draftkings"]["opponent"]}</td>
									// 	<td>{data["stats"]["fanduel"] ? data["stats"]["fanduel"]["salary"] : null}</td>
									// 	<td>{data["stats"]["fanduel"] ? data["stats"]["fanduel"]["ownership_projection"] : null}</td>
									// 	<td>{data["stats"]["draftkings"] ? data["stats"]["draftkings"]["salary"] : null}</td>
									// 	<td>{data["stats"]["draftkings"] ? data["stats"]["draftkings"]["ownership_projection"] : null}</td>
									// </tr>

									<tr>
										<td><strong><PlayerLink playerName={`${data["firstName"]} ${data["lastName"]}`}/></strong></td>
										<td>{data["position"]}</td>
										{/* <td>{data["teamAbbreviation"]}</td> */}
										<td>{data["game"]["homeTeam"]}</td>
										<td>${data["salary"]}</td>
										<td>{data["oprk"]}</td>
									</tr>

								))}
							</tbody>
						</table>
					</div>
				</div>
			}</>:<Roller />}
		</div>
	)
}
export default UpcomingPage



// DEPRECATED CODE
		// const getFanduelPlayers = async () => {

	// 	const res = await fetch("https://api.fanduel.com/fixture-lists/78816/players?content_sources=NUMBERFIRE,ROTOWIRE,ROTOGRINDERS", {
	// 		headers: {
	// 			"authority": "api.fanduel.com",
	// 			"method": "GET",
	// 			"path": "/fixture-lists/78816/players?content_sources=NUMBERFIRE,ROTOWIRE,ROTOGRINDERS",
	// 			"scheme": "https",
	// 			"accept": "application/json",
	// 			"accept-encoding": "gzip, deflate, br",
	// 			"accept-language": "en-US,en;q=0.9",
	// 			"authorization": "Basic ZWFmNzdmMTI3ZWEwMDNkNGUyNzVhM2VkMDdkNmY1Mjc6",
	// 			"origin": "https://www.fanduel.com",
	// 			"referer": "https://www.fanduel.com/",
	// 			"sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
	// 			"sec-ch-ua-mobile": "?0",
	// 			"sec-ch-ua-platform": "macOS",
	// 			"sec-fetch-dest": "empty",
	// 			"sec-fetch-mode": "cors",
	// 			"sec-fetch-site": "same-site",
	// 			"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
	// 			"x-auth-token": "eyJraWQiOiIxIiwiYWxnIjoiUlMyNTYifQ.eyJzZXMiOjE1NzIxODMzNDcsInN1YiI6OTI3Mzc0NSwidXNuIjoibnJhd3RoMTIiLCJwcmQiOiJERlMiLCJjcnQiOjE2NjAwMDA0MDAsImVtbCI6Im5vbGFucnJvdGgxMkBnbWFpbC5jb20iLCJzcmMiOjQsInJscyI6WzFdLCJtZmEiOmZhbHNlLCJ0eXAiOjEsImV4cCI6MTY2MDA0MzYwMH0.BVTqDwOyvTUg_2LxzA_581lpQZURx0QiaffQ6oQHvxDrwgB7EVBCRcfH9_MSCDd-YYBkNazjnl49siSIC9SL7WUpzPPDEPyT8ALJY3SQIasaau0nC8fFqHddgoqzcHNYciyW4twIlbG9QzV81iyfJ5Xnhbz_sN-sUfFqovqWATGShN3az834eHkXi_rNGYJRcTIJBmReezQuD6c806MEiXS1h9hPSDbfeEAhEkpYtl0lE0OSNCItpTAKbsfWi3UQ1Fp8q-hoGt0oNodBHEoBvIV52aEUpHKECqnt8jcNXLeNKRZy_z6tfPXEuJjcLJlNub1ljxs8QS0EAuVNekh92A",
	// 			"x-brand": "FANDUEL",
	// 			"x-currency": "USD",
	// 			"x-geo-packet": "eyJhbGciOiJSUzI1NiJ9.eyJzdGF0ZSI6Ik5KIiwicHJvZHVjdCI6IkRGUyIsImdjX3RyYW5zYWN0aW9uX2lkIjoiNjRkMTE0M2IxZDFiNmZlYSIsInRpbWVzdGFtcCI6IjIwMjItMDgtMDhUMjM6MTM6MjguMTYxWiIsInVzZXJfaWQiOiI5MjczNzQ1IiwicmVzdWx0IjpmYWxzZSwiZXJyb3JfbWVzc2FnZSI6InNwb29maW5nX2RldGVjdGlvbiIsInRyb3VibGVzaG9vdGVyIjpbeyJtZXNzYWdlIjoiV2UgbmVlZCB0byBjb25maXJtIHlvdSdyZSBpbiBhbiBhcmVhIHdoZXJlIGl0J3MgbGVnYWwgdG8gcGxheSBpbiBwYWlkIGNvbnRlc3RzLiBQbGVhc2UgZGlzYWJsZSBicm93c2VyIGV4dGVuc2lvbnMgb3Igb3RoZXIgYXBwcyB0aGF0IG1pZ2h0IG9ic2N1cmUgeW91ciBsb2NhdGlvbi4iLCJydWxlIjoic3Bvb2ZpbmdfZGV0ZWN0aW9uIiwicmV0cnkiOnRydWV9XSwiaXBfYWRkcmVzcyI6Ijk5LjAuODIuMTM4Iiwic2Vzc2lvbl9pZCI6MTU3MjE4MzM0NywiY291bnRyeV9jb2RlIjoiVVMiLCJyZWdpb25fY29kZSI6IkNBIn0.BlbV1adrJSZ1lShnAHFwhWYvZP0wBIC1b0YAWGh8eAUtkluUI0tUy-bMaCPlcAxjvlrH0CR1V6WJQrrlz85ncruJnX9795WEbtrDF-PRFR3pVwv7i0F6a8XmbPo9ThJtZj_NUGl_Lp-qeD8p3TOylJ_CEtFU_u5PiLMqo0VLTaAyQyqlRdYkn8zt-s45d6L5Pt5dt3Prz8I-edTNKrqSZJPI48b6RnTkesO-OwK2w7FV2Du3XhcFzxFuatwfOsUrwqKbAo5TPZb8eh9njcUmcVIRnrSi111_BOgTeI6swhlXszPXUJzIt6mKNB73LkYPx9nNor_MQkPY3BGUhpog7A",
	// 			"x-px-context": "_px3=9b32f0c31b8a53d591554b26deaad6224fb05b892bd7dfdd8f721522914b633a:V8YrSa73/NoD/JiwbF8ebvm43bfQhhVhTcXUXajj2HlPom1zkZhmY27tu+HNmjeAVAI2oDVjEB+ORvasoiyXnA==:1000:UU+v4mAmR+f8W6WDNo5Forj8RVKjf9yfpVqXmfPifOqXd5x0Wk3CJNevtwtoPyazRXZBHMzBrv0Dm+7Qk4Pcrfvl4TmmRvwS9UMuh30E55zm7AcbX5J7r4V/ZVP3InKU00BQx0teYdFU733gApu3edrnOWUfJyvaQhe28AVOofi3uVz183yRBxqL3ClicwYy9hAt8HZLRfhi/YnTjFH1tg==;_pxvid=9c09f95c-176f-11ed-99ff-4c4254494865;pxcts=9c0a0710-176f-11ed-99ff-4c4254494865"
	// 		}
	// 	})
	// 	const players = await res.json()
	// 	console.log(players)

				// const getScoreboard = async () => {
	// 	// url for current week scoreboard
	// 	// const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York"
	// 	// use seasonType = 1 for preseason, seasonType = 2 for regular season
	// 	// const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York&seasontype=1&weeks=3&dates=2022"
	// 	const url = "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York&seasontype=2&weeks=3&dates=2022"
	// 	const res = await fetch(url)
	// 	const data = await res.json()
	// 	setGames(data["sports"][0]["leagues"][0]["events"])
	// }