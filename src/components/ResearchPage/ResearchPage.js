import './ResearchPage.scss'
import { useState, useEffect } from 'react'

const ResearchPage = () => {

	const [lineupsCount, setLineupsCount] = useState()

	useEffect(() => {
		getStats()
	}, [])

  const getStats = async () => {
  	const res = await fetch(`/research/lineups/count`, {
  		method: "GET",
  		headers: {
  			"x-access-token": sessionStorage.dfsTrackerToken
  		}
  	})
  	const result = await res.json()
  	setLineupsCount(result["count"])
  }

  return (
    <div className="research-page">
    	<h2>Hello World</h2>
    	<p>{lineupsCount}</p>
    </div>
  )
}

export default ResearchPage