import React from 'react';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LineupsPage.scss';
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import LineupCard from './LineupCard/LineupCard'
import SingleLineupPage from '../SingleLineupPage/SingleLineupPage'
import PointsGraph from './PointsGraph/PointsGraph'
import BankrollGraph from './BankrollGraph/BankrollGraph'
import PlacementGraph from './PlacementGraph/PlacementGraph'
import LineupsTable from './LineupsTable/LineupsTable'
import SideNav from '../SideNav/SideNav'
import { Roller } from 'react-awesome-spinners'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake } from 'react-icons/fa'
import axios from 'axios'
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";

const LineupsPage = () => {

	const [lineups, setLineups] = useState([])
	const [loadingLineups, setLoadingLineups] = useState(true)
	const [showNewLineupForm, setShowNewLineupForm] = useState(false)
	const [years, setYears] = useState([])
	const [filteredYears, setFilteredYears] = useState(null)
	const [pointsGraphData, setPointsGraphData] = useState([])
	const [bankrollGraphData, setBankrollGraphData] = useState([])
	const [placementGraphData, setPlacementGraphData] = useState([])
	const [loadingPointsGraph, setLoadingPointsGraph] = useState(true)
	const [loadingBankrollGraph, setLoadingBankrollGraph] = useState(true)
	const [newLineupYear, setNewLineupYear] = useState('')
	const [newLineupWeek, setNewLineupWeek] = useState('')
	const [newLineupBet, setNewLineupBet] = useState('')
	const [newLineupWinnings, setNewLineupWinnings] = useState('')
	const [graphView, setGraphView] = useState('bankroll')
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [lineupCount, setLineupCount] = useState(0)
	const [maxScore, setMaxScore] = useState(0)
	const [highestWin, setHighestWin] = useState(0)
	const [highestPercentile, setHighestPercentile] = useState(0)
  
  useEffect(() => {
  	loadPage()
  }, [])

  useEffect(() => {
  	getYears()
  	loadGraphData()
  }, [loadingLineups])

  useEffect(() => {
  	loadGraphData()
  }, [filteredYears])

  const loadPage = async () => {
  	await getUserLineups()
  }

  const getUserLineups = async () => {
  	const res = await axios.get('/users', {
  		headers: {
  			'x-access-token': sessionStorage.dfsTrackerToken
  		}
  	})
    const userLineups = res.data
    await setLineups(userLineups)
    setLoadingLineups(false)
  }

 	const getYears = () => {
 		var temp = [...years]
 		lineups.length > 0 && lineups.map((lineup) => {
 			if (!(temp.includes(lineup.year))) {
 				temp.push(lineup.year)
 			}
 		})
 		setYears(temp.sort().reverse())
 	}

 	const loadGraphData = () => {
 		setLoadingPointsGraph(true)
 		setLoadingBankrollGraph(true)
 		var data = []
 		var bankRollSum = 0
 		var lineups_copy = [...lineups]
 		var max_percentile = 0
 		var max_points = 0
 		var max_win = 0
 		lineups_copy.reverse()

 		lineups_copy.length > 0 && lineups_copy.map((lineup) => {
 			if (filteredYears == null || filteredYears == lineup.year) {
	 			bankRollSum += (lineup.winnings - lineup.bet)
	 			var week_string = `${lineup.year}/${lineup.week}`
	 			var sameWeeks =  data.filter(week => week.week === week_string)
	 			max_points = Math.max(max_points, lineup.points)
	 			max_win = Math.max(max_win, lineup.winnings - lineup.bet)
	 			max_percentile = Math.max(max_percentile, lineup.percentile)
	 			if (sameWeeks.length > 0) {
	 				sameWeeks[0]["bankroll"] = bankRollSum
	 				sameWeeks[0]["points"] = (sameWeeks[0]["points"] * sameWeeks[0]["lineup_count"] + lineup.points) / (sameWeeks[0]["lineup_count"] + 1)
	 				sameWeeks[0]["lineup_count"] += 1
	 				if (data.length > 1) {
	 					sameWeeks[0]["points_change"] = sameWeeks[0]["points"] - data[data.length - 2]["points"]
	 					sameWeeks[0]["bankroll_change"] = bankRollSum - data[data.length - 2]["bankroll"]
	 				}
	 			} else {
		 			var lineup_data = {}
		 			lineup_data["points"] = lineup.points
		 			lineup_data["lineup_count"] = 1
		 			lineup_data["bankroll"] = bankRollSum
		 			lineup_data["week"] = week_string
		 			if (data.length > 0) {
		 				lineup_data["points_change"] = (lineup.points - data[data.length - 1]["points"])
		 				lineup_data["bankroll_change"] = (bankRollSum - data[data.length - 1]["bankroll"])
		 			}
		 			data.push(lineup_data)
		 		}
		 	}
		 	setLineupCount(data.length)
		 	setHighestWin(max_win)
		 	setMaxScore(max_points)
		 	setHighestPercentile(max_percentile)
	 	})	

		setPointsGraphData(data)
		setBankrollGraphData(data)
		setLoadingPointsGraph(false)
		setLoadingBankrollGraph(false)
 	}

 	const getExtras = () => {
 		setLineupCount(lineups.length)
 		const a = Math.max(...lineups.map(lineup => (lineup.winnings - lineup.bet)))
 		setHighestWin(a)
 		const b = Math.max(...lineups.map(lineup => (lineup.percentile)))
 		setHighestPercentile(b)
 		const c = Math.max(...lineups.map(lineup => (lineup.points)))
 		setMaxScore(c)
 	}


  const createLineup = async (year, week, bet, winnings) => {
 		var data = {}
		data["year"] = year
		data["week"] = week
		data["bet"] = bet
		data["winnings"] = winnings
		if (isNaN(year) || isNaN(week) || isNaN(bet) || isNaN(winnings)) {
			alert("New lineup year, week, bet, and winnings must be numbers!")
		}
		else {
	  	const res = await fetch(`/lineups`, {
	  		method: 'POST',
	  		headers: {
	  			'x-access-token': sessionStorage.dfsTrackerToken
	  		},
	  		body: JSON.stringify(data)
	  	})
	  	if (res.status === 200) {
	  		alert('New lineup created!')
	  		data = await res.json()
	  		window.location.href = `lineups/${data["id"]}/${data["week"]}/${data["year"]}`
	  	} else if (res.status === 400) {
	  		alert('Lineup cannot be created for the specified week and year!')
	  	} else {
	  		alert('An error occured while creating lineup!')
	  	}
	  }
  	getUserLineups(sessionStorage.dfsTrackerUserId)
  }

  const submitNewLineupForm = async () => {
  	await createLineup(newLineupYear, newLineupWeek, newLineupBet, newLineupWinnings)
  	setNewLineupWeek('')
  	setNewLineupYear('')
  	setNewLineupBet('')
  	setNewLineupWinnings('')
  }

  const onFileChange = (e) => {
  	setSelectedFile(e.target.files[0])
  }

  const onFileUpload = async () => {
  	var data = new FormData()
  	data.append("myFile", selectedFile, selectedFile.name)
  	const res = await fetch('/lineups/upload', {
  		method: 'POST',
  		headers: {
  			'x-access-token': sessionStorage.dfsTrackerToken
  		},
  		body: data
  	})
  	if (res.status === 200) {
  		alert('Lineup successfully uploaded!')
  		setShowImportDialog(false)
  		setSelectedFile(null)
  	} else {
  		alert('Failed to upload lineups!')
  	}
  	getUserLineups()
  }

  return (
  	<div className="lineups-page page">
  		{!loadingLineups ?
  		<>
  			<div className="main container">
					<div className="filter-btn-wrapper">
						<h2>Filter: </h2>
						<button className={`filter-btn${filteredYears == null ? "-active" : ""}`} onClick={() => setFilteredYears(null)}>All</button>
						{years.length > 0 && years.map((year) => 
							<button className={`filter-btn${filteredYears == year ? "-active" : ""}`} 
								onClick={() => setFilteredYears(year)}>{year}</button>
						)}
  				</div>

  				<div className="cards-wrapper">
  					<div className="card">
  						<p className="number">{lineupCount}</p>
  						<p className="desc">Total Lineups</p>
  					</div>
  					<div className="card">
  						<p className="number">{maxScore} Pts</p>
  						<p className="desc">Max Score</p>
  					</div>
  					<div className="card">
  						<p className="number">${highestWin}</p>
  						<p className="desc">Highest Win</p>
  					</div>
  					<div className="card">
  						<p className="number">{highestPercentile.toFixed(2)}%</p>
  						<p className="desc">Highest Percentile Finish</p>
  					</div>
  				</div>
			  	<div className="graphs-wrapper row">

						{ graphView === 'points' &&
						<>
					    { !loadingPointsGraph ? 
					    	<PointsGraph 
					    		graphData={pointsGraphData} 
					    		year={filteredYears}
					    		setGraphView={setGraphView}
					    	/> 
					    : 
					    	<>
					    		<Roller /> 
					    	</>
					   	}
					  </>
					  }
					  { graphView === 'bankroll' &&
					  <>
					    { !loadingBankrollGraph ? 
					    	<BankrollGraph 
					    		graphData={bankrollGraphData} 
					    		year={filteredYears}
					    		setGraphView={setGraphView}
					    	/> 
					    : 
					    	<>
					    		<Roller />
					    	</>
					    }
					  </>
					 	}
				  </div>
		    </div>

		    <div className="lineupform-wrapper">
				  <button className="search-btn" 
				  	onClick={() => setShowNewLineupForm(true)}
				  	>Create New Lineup</button>
				  <button className="search-btn"
				  	onClick={() => setShowImportDialog(true)}
				  	>Import Lineups</button>
				 </div>

				  <Dialog
				  	open={showNewLineupForm}>
				  	<DialogTitle>New Lineup</DialogTitle>
				  	<DialogContent>
				    	<div>
				    		<label>Year: </label>
				    		<input className="form-control" type="text" placeholder="Enter Lineup Year" value={newLineupYear}
				    			onChange={(e) => setNewLineupYear(e.target.value)} />
				    		<hr />
				    		<label>Week: </label>
				    		<input className="form-control" type="text" placeholder="Enter Lineup Week" value={newLineupWeek}
				    		onChange={(e) => setNewLineupWeek(e.target.value)} />
				    		<hr />
				    	</div>
				    	<div>
				    		<label>Bet: </label>
				    		<input className="form-control" type="text" placeholder="Enter Bet Amount" value={newLineupBet}
				    		onChange={(e) => setNewLineupBet(e.target.value)} />
				    		<hr />
				    		<label>Winings: </label>
				    		<input className="form-control" type="text" placeholder="Enter Winnings Amount" value={newLineupWinnings}
				    		onChange={(e) => setNewLineupWinnings(e.target.value)} />
				    		<hr />
				    	</div>
				  	</DialogContent>
				  	<DialogActions className="dialog-actions">
				  		<button className="close-btn btn" onClick={() => setShowNewLineupForm(false)}>Close</button>
				  		<button className="submit-btn btn" onClick={() => submitNewLineupForm()}>Submit</button>
				  	</DialogActions>
				  </Dialog>

				  <Dialog
				  	open={showImportDialog}>
				  	<DialogTitle>Import Lineup Data</DialogTitle>
				  	<DialogContent>
				    	<div>
							  <p>Upload a CSV file to create new lineups.</p>
				    	</div>
				  		<div>
					  		<input 
					  			type="file" 
					  			onChange={onFileChange}
					  			accept=".csv"
					  		/>
					  	</div> 
				  	</DialogContent>
				  	<DialogActions className="dialog-actions">
				  		<button className="close-btn btn" onClick={() => setShowImportDialog(false)}>Close</button>
				  		<button className="submit-btn btn" onClick={onFileUpload}>Upload</button>
				  	</DialogActions>
				  </Dialog>

				<div className="lineups-wrapper container">
					<LineupsTable 
						lineups={lineups.filter(lineup => {
							return filteredYears === null || lineup.year === filteredYears
						})} 
						filteredYears={filteredYears} />
				</div>
		  </> 
		 : 
		 	<div className="loading-screen">
		 		<Roller />
		  </div>}
	</div>
  )
}

export default LineupsPage