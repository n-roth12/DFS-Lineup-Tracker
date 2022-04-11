import React from 'react';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LineupsPage.css';
import Navbar from '../Navbar/Navbar'
import LineupCard from './LineupCard/LineupCard'
import SingleLineupPage from '../SingleLineupPage/SingleLineupPage'
import PointsGraph from './PointsGraph/PointsGraph'
import BankrollGraph from './BankrollGraph/BankrollGraph'
import { Ellipsis } from 'react-awesome-spinners'
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
	const [loadingPointsGraph, setLoadingPointsGraph] = useState(true)
	const [loadingBankrollGraph, setLoadingBankrollGraph] = useState(true)
	const [newLineupYear, setNewLineupYear] = useState('')
	const [newLineupWeek, setNewLineupWeek] = useState('')
	const [newLineupBet, setNewLineupBet] = useState('')
	const [newLineupWinnings, setNewLineupWinnings] = useState('')
  
  useEffect(() => {
  	loadPage()
  }, [])

  useEffect(() => {
  	getYears()
  	loadGraphData()
  }, [loadingLineups])

  const loadPage = async () => {
  	await getUserLineups(sessionStorage.dfsTrackerToken)
  }

  const getUserLineups = async (token) => {
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
 		setYears(temp)
 	}

 	const loadGraphData = async () => {
 		setLoadingPointsGraph(true)
 		setLoadingBankrollGraph(true)
 		var data = []
 		var bankRollSum = 0
 		lineups.length > 0 && lineups.reverse().map((lineup) => {
 			bankRollSum += (lineup.winnings - lineup.bet)
 			var week_string = `${lineup.year}/${lineup.week}`
 			var sameWeeks =  data.filter(week => week.week === week_string)
 			if (sameWeeks.length > 0) {
 				sameWeeks[0]["bankroll"] = bankRollSum
 				sameWeeks[0]["points"] = (sameWeeks[0]["points"] * sameWeeks[0]["lineup_count"] + lineup.points) / (sameWeeks[0]["lineup_count"] + 1) 
 				sameWeeks[0]["lineup_count"] += 1
 				if (data.length > 0) {
 					sameWeeks[0]["points_change"] = (sameWeeks[0]["points"] - data[data.length - 1]["points"]).toFixed(2)
 					sameWeeks[0]["bankroll_change"] = (bankRollSum - data[data.length - 1]["bankroll"]).toFixed(2)
 				}
 			} else {
	 			var lineup_data = {}
	 			lineup_data["points"] = lineup.points
	 			lineup_data["lineup_count"] = 1
	 			lineup_data["bankroll"] = bankRollSum
	 			lineup_data["week"] = week_string
	 			if (data.length > 0) {
	 				lineup_data["points_change"] = (lineup.points - data[data.length - 1]["points"]).toFixed(2)
	 				lineup_data["bankroll_change"] = (bankRollSum - data[data.length - 1]["bankroll"]).toFixed(2)
	 			}
	 			data.push(lineup_data)
	 		}
 		})
		await setPointsGraphData(data)
		await setBankrollGraphData(data)
		setLoadingPointsGraph(false)
		setLoadingBankrollGraph(false)
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

  return (
  	<>
  		<Navbar />
  		{!loadingLineups ?
  		<>
  			<div className="main container">
			  	<div className="graphs-wrapper row">
				    { !loadingPointsGraph ? <PointsGraph graphData={pointsGraphData} /> : 
				    	<>
				    		<h1>Loading Points Graph...</h1> 
				    		<Ellipsis /> 
				    	</>
				   	}
				    { !loadingBankrollGraph ? <BankrollGraph graphData={bankrollGraphData} /> : 
				    	<>
				    		<h1>Loading Bankroll Graph...</h1> 
				    		<Ellipsis />
				    	</>
				    }
				  </div>
		    </div>
		    <div className="lineupform-wrapper container">
				  <button className="toggle-lineupform-btn" 
				  	onClick={() => setShowNewLineupForm(true)}
				  	>Create New Lineup</button>
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
				</div>

				<div className="filter-btn-wrapper">
					<button className={`filter-btn${filteredYears == null ? "-active" : ""}`} onClick={() => setFilteredYears(null)}>All</button>
					{years.length > 0 && years.reverse().map((year) => 
						<button className={`filter-btn${filteredYears == year ? "-active" : ""}`} 
							onClick={() => setFilteredYears(year)}>{year}</button>
					)}
				</div>

				<div className="lineups-wrapper container">
					<table className="lineups-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Points</th>
								<th>Wager</th>
								<th>Winnings</th>
								<th>Profit</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							{lineups.length > 0 && lineups.map((lineup) => 
								<>
		    					{(filteredYears == null || lineup.year == filteredYears) &&
				    				<tr>
				    					<td>Week {lineup.week}, {lineup.year}</td>
				    					<td >{lineup.points > 140 &&<FaFire style={{color: "orange"}}/>} 
				    								{lineup.points < 90 && <FaSnowflake style={{color:"blue"}}/>}
				    								{lineup.points} PTS</td>
				    					<td>${lineup.bet}</td>
				    					<td>${lineup.winnings}</td>
				    					<td style={{color:lineup.bet > lineup.winnings ? "red" : "green"}}>{`${lineup.bet > lineup.winnings ? "-" : "+"}\$${Math.abs(lineup.winnings - lineup.bet)}`}</td>
				    					<td><Link to={`/lineups/${lineup.id}/${lineup.week}/${lineup.year}`}
				    						className="view-lineup-btn">Edit Lineup<FaAngleRight/></Link></td>
				    				</tr>
				    			}
				    		</>
				    	)}
						</tbody>
					</table>
				</div>
		  </> : <h1>Loading Lineups...</h1>}


	</>
  )
}

export default LineupsPage