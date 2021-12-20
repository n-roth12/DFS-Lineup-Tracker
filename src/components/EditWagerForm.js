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
	    <form className="wagerform" onSubmit={onSubmit}>
	    	<div className="form-control">
	    		<label>Bet: </label>
	    		<input type="text" placeholder="Enter Bet Amount" value={bet}
	    			onChange={(e) => setBet(e.target.value)} />
	    		<label>Winnings: </label>
	    		<input type="text" placeholder="Enter Winnings Amount" value={winnings}
	    		onChange={(e) => setWinnings(e.target.value)} />
	    		<input type="submit" value="Submit Wager Changes" className="" />
	    	</div>
	    </form>
	  </div>
  )
}

export default EditWagerForm