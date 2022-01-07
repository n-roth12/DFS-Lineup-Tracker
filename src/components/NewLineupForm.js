import { useState } from 'react'

const NewLineupForm = ({ onAdd }) => {
	const [year, setYear] = useState(null)
	const [week, setWeek] = useState(null)
	const [bet, setBet] = useState(0)
	const [winnings, setWinnings] = useState(0)

	const onSubmit = (e) => {
		e.preventDefault()

		if (!year || !week) {
			alert('Please enter a year and a week.')
			return 
		}

		onAdd(year, week, bet, winnings)

		setYear(null)
		setWeek(null)
		setBet(0)
		setWinnings(0)
	}

  return (
  	<div className="lineupform">
	    <form className="container" onSubmit={onSubmit}>
	    	<div>
	    		<label>Year: </label>
	    		<input className="form-control" type="text" placeholder="Enter Lineup Year" value={year}
	    			onChange={(e) => setYear(e.target.value)} />
	    		<hr />
	    		<label>Week: </label>
	    		<input className="form-control" type="text" placeholder="Enter Lineup Week" value={week}
	    		onChange={(e) => setWeek(e.target.value)} />
	    		<hr />
	    	</div>
	    	<div>
	    		<label>Bet: </label>
	    		<input className="form-control" type="text" placeholder="Enter Bet Amount" value={bet}
	    		onChange={(e) => setBet(e.target.value)} />
	    		<hr />
	    		<label>Winings: </label>
	    		<input className="form-control" type="text" placeholder="Enter Winnings Amount" value={winnings}
	    		onChange={(e) => setWinnings(e.target.value)} />
	    		<hr />
	    	</div>
	    	<div className="row">
	    		<input className="form-submit-btn" type="submit" value="Create Lineup" />
	    	</div>
	    </form>
	  </div>
  )
}

export default NewLineupForm


