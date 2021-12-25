import React from 'react';
import { useState, useEffect } from 'react'
import LineupCard from './LineupCard'
import SingleLineupPage from './SingleLineupPage'
import NewLineupForm from './NewLineupForm'
import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis } from'recharts'

const LineupsPage = () => {

	const [lineups, setLineups] = useState([])
	const [loading, setLoading] = useState(false)
	const [showNewLineupForm, setShowNewLineupForm] = useState(false)
	const [years, setYears] = useState([])
	const [filteredYears, setFilteredYears] = useState(null)
	const [graphData, setGraphdata] = useState([])
	const [loadingGraph, setLoadingGraph] = useState(false)
	// [
	//   {
	//     name: 'January',
	//     Iphone: 4000
	//   },
	//   {
	//     name: "March",
	//     Iphone: 1000,
	//   },
	//   {
	//     name: "May",
	//     Iphone: 4000,
	//   },
	//   {
	//     name: "July",
	//     Iphone: 800,
	//   },
	//   {
	//     name: "October",
	//     Iphone: 1500,
	//   },
	// ]
  
  useEffect(() => {
  	getUserLineups(1)
  }, [])

  useEffect(() => {
  	getYears()
  }, [lineups])

  const getUserLineups = async (user_id) => {
  	setLoading(true)
  	setLoadingGraph(true)
    const res = await fetch(`users/${user_id}`)
    const userLineups = await res.json()
    await setLineups(userLineups)
    getYears()
    await setLoading(false)
    loadGraphData()
    setLoadingGraph(false)
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

 	const loadGraphData = () => {
 		var data = []
 		lineups.map((lineup) => {
 			var temp = {}
 			temp["week"] = lineup.week
 			temp["points"] = lineup.points
 			temp["return"] = lineup.winnings - lineup.bet
 			data.push(temp)
 		})
 		setGraphdata(data)
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

  if (!loading) {
	  return (
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

		   	<div className="row">
		   		<h1>Points Progress</h1>
		   		<div className="linechart-wrapper">
			      <LineChart
			        width={500}
			        height={300}
			        data={graphData}
			        margin={{
			          top: 20,
			          right: 30,
			          left: 0,
			          bottom: 10,
			        }}>
			        <CartesianGrid  horizontal="true" vertical="" stroke="#202033"/>
			        <XAxis dataKey="week" tick={{fill:"#000000"}}/>
			        <YAxis tick={{fill:"#000000"}} />
			        <Line type="monotone" dataKey="points" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033",strokeWidth: 2,r:5}} activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 5,r:10}} />
		      	</LineChart>
		    	</div>
		    </div>
		    <div>
		   		<h1>Bankroll Progress</h1>
		   		<div className="linechart-wrapper">
			      <LineChart
			        width={500}
			        height={300}
			        data={graphData}
			        margin={{
			          top: 20,
			          right: 30,
			          left: 0,
			          bottom: 10,
			        }}>
			        <CartesianGrid  horizontal="true" vertical="" stroke="#202033"/>
			        <XAxis dataKey="week" tick={{fill:"#000000"}}/>
			        <YAxis tick={{fill:"#000000"}} />
			        <Line type="monotone" dataKey="return" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033",strokeWidth: 2,r:2}} activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 5,r:10}} />
		      	</LineChart>
		    	</div>
		    </div>
		</>
	  )
	} else {
		return (
			<div>
				<h1>Loading</h1>
			</div>
		)
	}
}

export default LineupsPage