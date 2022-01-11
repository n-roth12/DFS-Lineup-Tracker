import React from 'react';
import { useState, useEffect } from 'react'
import LineupCard from './LineupCard'
import SingleLineupPage from './SingleLineupPage'
import NewLineupForm from './NewLineupForm'
import PointsGraph from './PointsGraph'
import BankrollGraph from './BankrollGraph'
import { Ellipsis } from 'react-awesome-spinners'

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
  
  useEffect(() => {
  	loadPage()
  }, [])

  useEffect(() => {
  	getYears()
  	loadGraphData()
  }, [loadingLineups])

  const loadPage = async () => {
  	await getUserLineups(1)
  	await loadPlayerCounts()
  }

  const getUserLineups = async (user_id) => {
    const res = await fetch(`users/${user_id}`)
    const userLineups = await res.json()
    await setLineups(userLineups)
    setLoadingLineups(false)
  }

 	const getYears = () => {
 		var temp = [...years]
 		lineups.map((lineup) => {
 			if (!(temp.includes(lineup.year))) {
 				temp.push(lineup.year)
 			}
 		})
 		setYears(temp)
 	}

 	const loadPlayerCounts = async () => {
 		const res = await fetch(`/best_week/${1}`)
 	}

 	const loadGraphData = async () => {
 		setLoadingPointsGraph(true)
 		setLoadingBankrollGraph(true)
 		var data1 = []
 		var data2 = []
 		var bankRollSum = 0
 		lineups.reverse().map((lineup) => {
 			var temp1 = {}
 			var temp2 = {}
 			temp1["week"] = `${lineup.year}/${lineup.week}`
 			temp2["week"] = `${lineup.year}/${lineup.week}`
 			temp1["points"] = lineup.points
 			const newBankRollSum = bankRollSum + (lineup.winnings - lineup.bet)
 			temp2["return"] = newBankRollSum
 			bankRollSum = newBankRollSum
 			data1.push(temp1)
			data2.push(temp2)
 		})
		await setPointsGraphData(data1)
		await setBankrollGraphData(data2)
		setLoadingPointsGraph(false)
		setLoadingBankrollGraph(false)
 	}

  const createLineup = async (year, week, bet, winnings) => {
 		var data = {}
		data["user_id"] = 1
		data["year"] = year
		data["week"] = week
		data["bet"] = bet
		data["winnings"] = winnings
  	await fetch(`/lineups`, {
  		method: 'POST',
  		headers: {
  			'Content-type': 'application.json'
  		},
  		body: JSON.stringify(data)
  	})
  	getUserLineups(1)
  }

  return (
  	<>
  		{!loadingLineups ?
  		<>
		    <h1>Lineups</h1>

		    <div className="lineupform-wrapper container">
		    	{showNewLineupForm && <NewLineupForm onAdd={createLineup} />}
				  <button className="toggle-lineupform-btn" 
				  	onClick={() => setShowNewLineupForm(!showNewLineupForm)}
				  	>{showNewLineupForm ? "Hide" : "Create New Lineup"}</button>
				</div>

				<div className="filter-btn-wrapper">
					<button className={`filter-btn${filteredYears == null ? "-active" : ""}`} onClick={() => setFilteredYears(null)}>All</button>
					{years.length > 0 && years.map((year) => 
						<button className={`filter-btn${filteredYears == year ? "-active" : ""}`} 
							onClick={() => setFilteredYears(year)}>{year}</button>
					)}
				</div>

		    <div className="lineups-wrapper">
		    	{lineups.length > 0 ? lineups.map((lineup) => 
		    		<>
		    			{(filteredYears == null || lineup.year == filteredYears) &&
		    				<LineupCard key={lineup.id} lineup={lineup} />
		    			}
		    		</>
		    	) : <p>No lineups to show.</p>}
		    </div>
		  </> : <h1>Loading Lineups...</h1>}

		  <div className="container">
		  	<div className="graphs-wrapper row">
		  		<h1>History</h1>
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

	</>
  )
}

export default LineupsPage