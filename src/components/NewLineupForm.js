import { useState } from 'react'

const NewLineupForm = ({ onAdd }) => {
	const [year, setYear] = useState(null)
	const [week, setWeek] = useState(null)

	const onSubmit = (e) => {
		e.preventDefault()

		if (!year || !week) {
			alert('Please add missing information!')
			return 
		}
		onAdd( year, week )

		setYear(null)
		setWeek(null)
	}

  return (
  	<div className="lineupform-wrapper">
	    <form className="lineupform" onSubmit={onSubmit}>
	    	<div className="form-control">
	    		<label>Year: </label>
	    		<input type="text" placeholder="Add Lineup Year" value={year}
	    			onChange={(e) => setYear(e.target.value)} />
	    	</div>
	    	<div className="form-control">
	    		<label>Week: </label>
	    		<input type="text" placeholder="Add Lineup Week" value={week}
	    		onChange={(e) => setWeek(e.target.value)} />
	    	</div>
	    	<input type="submit" value="Create Lineup" />
	    </form>
	  </div>
  )
}

export default NewLineupForm


