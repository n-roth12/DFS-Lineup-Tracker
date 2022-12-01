import './ResearchPage.scss'
import { useState, useEffect } from 'react'

const ResearchPage = () => {
	const [lineupsCount, setLineupsCount] = useState()
	const [lineupsMax, setLineupsMax] = useState()
	const [lineupsHighest, setLineupsHighest] = useState()
	
	useEffect(() => {
		getStats()
	}, [])


  const getStats = async () => {
  	const res1 = await fetch(`/research/lineups/count`, {
  		method: "GET",
  		headers: {
  			"x-access-token": sessionStorage.dfsTrackerToken
  		}
  	})
  	const res2 = await fetch(`/research/lineups/max`, {
  		method: "GET",
  		headers: {
  			"x-access-token": sessionStorage.dfsTrackerToken
  		}
  	})
  	const res3 = await fetch(`/research/lineups/highest`, {
  		method: "GET",
  		headers: {
  			"x-access-token": sessionStorage.dfsTrackerToken
  		}
  	})
  	const result1 = await res1.json()
  	const result2 = await res2.json()
  	const result3 = await res3.json()
  	setLineupsCount(result1["count"])
  	setLineupsMax(result2["max"])
  	setLineupsHighest(result3["highest"])
  }


  return (
    <div className="research-page page">
    		{lineupsCount &&
    			<>
		    		<div className="research-section">
		    			<h2>Total Lineups: {lineupsCount}</h2>
		    		</div>
		    	</>
		    }
    		{lineupsMax && lineupsMax.points && 
    			<>
		    		<div className="research-section">
		    			<h2>Highest Lineup Score: {lineupsMax.points}</h2>
		    			<h2>Week {lineupsMax.week}, {lineupsMax.year}</h2>
		    		</div>
	    		</>
	    	}
	    	{lineupsHighest &&
	    		<>
		    		<div className="research-section">
		    			<h2>Highest Lineup Profit: {lineupsHighest > 0 && "+"}${lineupsHighest}</h2>
		    		</div>
		    	</>
		    }
    </div>
  )
}

export default ResearchPage





