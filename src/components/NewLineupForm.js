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
  	<div className="lineupform-wrapper">
	    <form className="lineupform" onSubmit={onSubmit}>
	    	<div className="form-control">
	    		<label>Year: </label>
	    		<input type="text" placeholder="Enter Lineup Year" value={year}
	    			onChange={(e) => setYear(e.target.value)} />
	    		<label>Week: </label>
	    		<input type="text" placeholder="Enter Lineup Week" value={week}
	    		onChange={(e) => setWeek(e.target.value)} />
	    	</div>
	    	<div className="form-control">
	    		<label>Bet: </label>
	    		<input type="text" placeholder="Enter Bet Amount" value={bet}
	    		onChange={(e) => setBet(e.target.value)} />
	    		<label>Winings: </label>
	    		<input type="text" placeholder="Enter Winnings Amount" value={winnings}
	    		onChange={(e) => setWinnings(e.target.value)} />
	    	</div>
	    	<input type="submit" value="Create Lineup" className="" />
	    </form>
	  </div>
  )
}

export default NewLineupForm


