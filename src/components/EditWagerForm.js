import { useState } from 'react'

const EditWagerForm = ({ lineup }) => {

	const [bet, setBet] = useState(lineup["bet"])
	const [winnings, setWinnings] = useState(lineup["winnings"])

	const onSubmit = async (e) => {
		e.preventDefault()

		if (!bet || !winnings) {
			alert('Please enter bet and winnings.')
			return
		}

 		var data = {}
		data["bet"] = bet
		data["winnings"] = winnings
  		await fetch(`/lineups/${lineup["id"]}`, {
	  		method: 'PUT',
	  		headers: {
	  			'Content-type': 'application.json'
	  		},
	  		body: JSON.stringify(data)
  		})
  		alert('Wager edit successful!')
  	}

  return (
  	<div className="wagerform-wrapper">
	    <form className="wagerform row" onSubmit={onSubmit}>
	    	<div className="col">
	    		<label>Bet: </label>
		    	<input className="form-control" type="text" placeholder="Enter Bet Amount" value={bet}
		    		onChange={(e) => setBet(e.target.value)} />
		    	<hr />
	    	</div>
	    	<div className="col">
	    		<label>Winnings: </label>
	    		<input className="form-control" type="text" placeholder="Enter Winnings Amount" value={winnings}
	    		onChange={(e) => setWinnings(e.target.value)} />
	    		<hr />
	    	</div>
	    	<div className="col">
	    		<input className="view-players-btn" type="submit" value="Submit Wager Changes" />
	    	</div>
	    </form>
	  </div>
  )
}

export default EditWagerForm