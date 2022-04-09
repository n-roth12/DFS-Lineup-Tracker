import { useState, useEffect } from 'react'

const EditWagerForm = ({ lineup }) => {

	const [bet, setBet] = useState(lineup["bet"])
	const [prevBet, setPrevBet] = useState(lineup["bet"])
	const [winnings, setWinnings] = useState(lineup["winnings"])
	const [prevWinnings, setPrevWinnings] = useState(lineup["winnings"])
	const [showCancelBtn, setShowCancelBtn] = useState(false)
	const [showSaveBtn, setShowSaveBtn] = useState(false)

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
  	setShowSaveBtn(false)
  	setShowCancelBtn(false)
  }

  useEffect(() => {
  	setShowSaveBtn(true)
  	setShowCancelBtn(true)
  }, [bet, winnings])

  const cancelChanges = async () => {
  	setBet(prevBet)
  	setWinnings(prevWinnings)
  }

  return (
  	<div className="wagerform-wrapper">

	    <form className="wagerform" onSubmit={onSubmit}>
	    	<div>
	    		<label>Buy-in: </label>
		    	<input className="form-control" type="text" placeholder="Enter Bet Amount" value={bet}
		    		onChange={(e) => setBet(e.target.value)} />
		    	<hr />
	    	</div>
	    	<div>
	    		<label>Winnings: </label>
	    		<input className="form-control" type="text" placeholder="Enter Winnings Amount" value={winnings}
	    		onChange={(e) => setWinnings(e.target.value)} />
	    		<hr />
	    	</div>
	    	{showSaveBtn && 
		    	<input className="view-players-btn" type="submit" value="Save Changes" />
	    	}
	    </form>
{/*	    {showCancelBtn && 
	   	  <button className="delete-lineup-btn"
        	onClick={() => cancelChanges()}>Cancel Changes</button>
      }*/}
	  </div>
  )
}

export default EditWagerForm