import React from 'react';
import { useState, useEffect } from 'react'
import LineupCard from './LineupCard'
import SingleLineupPage from './SingleLineupPage'
import NewLineupForm from './NewLineupForm'

const LineupsPage = () => {

	const [lineups, setLineups] = useState([])
	const [loading, setLoading] = useState(false)
	const [showNewLineupForm, setShowNewLineupForm] = useState(false)
  
  useEffect(() => {
  	getUserLineups(1)
  }, [])

  const getUserLineups = async (user_id) => {
  	setLoading(true)
    const res = await fetch(`users/${user_id}`)
    const userLineups = await res.json()
    setLineups(userLineups)
    setLoading(false)
  }

  const createLineup = async (year, week) => {
 		var data = {}
		data["user_id"] = 1
		data["year"] = year
		data["week"] = week
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
				  <button className="view-players-btn" 
				  	onClick={() => setShowNewLineupForm(!showNewLineupForm)}
				  	>{showNewLineupForm ? "Hide" : "Create New Lineup"}</button>
				</div>
		    <div className="lineups-wrapper">
		    	{lineups.length > 0 ? lineups.map((lineup) => {
		    		return <>
			    		<LineupCard key={lineup.id} lineup={lineup} />
		    		</>
		    	}) : <p>No lineups to show.</p>}
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