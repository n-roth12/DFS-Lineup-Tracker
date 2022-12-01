import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LineupsPage.scss';
import PointsGraph from './PointsGraph/PointsGraph'
import BankrollGraph from './BankrollGraph/BankrollGraph'
import LineupsTable from '../../TablesLists/LineupsTable/LineupsTable'
import ImportLineupsDialog from '../../Dialogs/ImportLineupsDialog/ImportLineupsDialog'
import DeleteLineupsDialog from '../../Dialogs/DeleteLineupsDialog/DeleteLineupsDialog';
import { Roller } from 'react-awesome-spinners'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaPlus, FaUpload, FaFileImport } from 'react-icons/fa'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { BiImport } from 'react-icons/bi'
import RoundButtonV1 from '../../Buttons/RoundButtonV1/RoundButtonV1';

const LineupsPage = () => {

	const [lineups, setLineups] = useState([])
	const [loadingLineups, setLoadingLineups] = useState(true)
	const [showNewLineupForm, setShowNewLineupForm] = useState(false)
	const [years, setYears] = useState([])
	const [filteredYears, setFilteredYears] = useState(null)
	const [pointsGraphData, setPointsGraphData] = useState([])
	const [bankrollGraphData, setBankrollGraphData] = useState([])
	const [placementGraphData, setPlacementGraphData] = useState([])
	const [loadingPointsGraph, setLoadingPointsGraph] = useState(true)
	const [loadingBankrollGraph, setLoadingBankrollGraph] = useState(true)
	const [newLineupYear, setNewLineupYear] = useState('')
	const [newLineupWeek, setNewLineupWeek] = useState('')
	const [newLineupBet, setNewLineupBet] = useState('')
	const [newLineupWinnings, setNewLineupWinnings] = useState('')
	const [graphView, setGraphView] = useState('bankroll')
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [selectedLineups, setSelectedLineups] = useState([])
	const [showDeleteLineupsDialog, setShowDeleteLineupsDialog] = useState(false)
	const [stateFilter, setStateFilter] = useState("past")
	const [siteFilter, setSiteFilter] = useState()
  
  useEffect(() => {
  	loadPage()
  }, [])

  const loadPage = async () => {
  	await getUserLineups()
  }

  const getUserLineups = async () => {
	const res = await fetch(`/users/lineups`, {
		method: 'GET',
		headers: {
		  'x-access-token': sessionStorage.dfsTrackerToken
		}
	})
    const userLineups = await res.json()
    setLineups(userLineups)
    setLoadingLineups(false)
  }

 	const getYears = () => {
 		var temp = [...years]
 		lineups && lineups.length > 0 && lineups.map((lineup) => {
 			if (!(temp.includes(lineup.year))) {
 				temp.push(lineup.year)
 			}
 		})
 		setYears(temp.sort().reverse())
 	}

	 const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }
  
    const onFileUpload = async () => {
        var data = new FormData()
        data.append("myFile", selectedFile, selectedFile.name)
        const res = await fetch('/lineups/upload', {
            method: 'POST',
            headers: {
                'x-access-token': sessionStorage.dfsTrackerToken
            },
            body: data
        })
        if (res.status === 200) {
            alert('Lineup successfully uploaded!')
            setShowImportDialog(false)
            setSelectedFile(null)
        } else {
            alert('Failed to upload lineups!')
        }
    }

	const closeImportDialog = () => {
		setShowImportDialog(false)
	}

	const deleteSelectedLineups = async (lineupsToDelete) => {
		console.log(lineupsToDelete)
		const res = await fetch('/lineups/delete', {
			method: 'POST',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			},
			body: JSON.stringify({
				"lineups": lineupsToDelete
			  })
		})
		const data = await res.json()
		console.log(data)
		setShowDeleteLineupsDialog(false)
	}


  const createLineup = async (year, week, bet, winnings) => {
 		var data = {}
		data["year"] = year
		data["week"] = week
		data["bet"] = bet
		data["winnings"] = winnings
		if (isNaN(year) || isNaN(week) || isNaN(bet) || isNaN(winnings)) {
			alert("New lineup year, week, bet, and winnings must be numbers!")
		}
		else {
	  	const res = await fetch(`/lineups`, {
	  		method: 'POST',
	  		headers: {
	  			'x-access-token': sessionStorage.dfsTrackerToken
	  		},
	  		body: JSON.stringify(data)
	  	})
	  	if (res.status === 200) {
	  		alert('New lineup created!')
	  		data = await res.json()
	  		window.location.href = `lineups/${data["id"]}/${data["week"]}/${data["year"]}`
	  	} else if (res.status === 400) {
	  		alert('Lineup cannot be created for the specified week and year!')
	  	} else {
	  		alert('An error occured while creating lineup!')
	  	}
	  }
  	getUserLineups(sessionStorage.dfsTrackerUserId)
  }

  const submitNewLineupForm = async () => {
  	await createLineup(newLineupYear, newLineupWeek, newLineupBet, newLineupWinnings)
  	setNewLineupWeek('')
  	setNewLineupYear('')
  	setNewLineupBet('')
  	setNewLineupWinnings('')
  }

  return (
  	<div className="lineups-page page">
		<div className='lineup-wrapper container' >
			<div className='filter-btn-wrapper'>
				<button onClick={() => setStateFilter("upcoming")} className={`underline-btn${stateFilter === "upcoming" ? " active" : ""}`}>Upcoming</button>
				<button onClick={() => setStateFilter("past")} className={`underline-btn${stateFilter === "past" ? " active" : ""}`}>History</button>
			</div>
			<div className='lineup-wrapper-header'>
				<Link to='/upcoming' className='lineup-options-btn'>Create Lineup <FaPlus className='icon'/></Link>
				<button className='lineup-options-btn' onClick={() => setShowImportDialog(true)}>Import <BiImport className='icon'/></button>
				{selectedLineups.length > 0 &&
					<button className='lineup-delete-btn' onClick={() => setShowDeleteLineupsDialog(true)}>Delete Lineups ({selectedLineups.length})</button>
				}
			</div>
			{stateFilter === "upcoming" &&
			<LineupsTable
				selectedLineups={selectedLineups}
				setSelectedLineups={setSelectedLineups}
				lineups={lineups.filter((lineup) => {
					return Date.parse(lineup["minStartTime"].split("T")[0]) > new Date()
				})}
			/>
			}
		</div>
  		{!loadingLineups && lineups ?
  		<>
			<Dialog
				open={showNewLineupForm}>
				<DialogTitle>New Lineup</DialogTitle>
				<DialogContent>
					<div>
						<label>Year: </label>
						<input className="form-control" type="text" placeholder="Enter Lineup Year" value={newLineupYear}
							onChange={(e) => setNewLineupYear(e.target.value)} />
						<hr />
						<label>Week: </label>
						<input className="form-control" type="text" placeholder="Enter Lineup Week" value={newLineupWeek}
						onChange={(e) => setNewLineupWeek(e.target.value)} />
						<hr />
					</div>
					<div>
						<label>Bet: </label>
						<input className="form-control" type="text" placeholder="Enter Bet Amount" value={newLineupBet}
						onChange={(e) => setNewLineupBet(e.target.value)} />
						<hr />
						<label>Winings: </label>
						<input className="form-control" type="text" placeholder="Enter Winnings Amount" value={newLineupWinnings}
						onChange={(e) => setNewLineupWinnings(e.target.value)} />
						<hr />
					</div>
				</DialogContent>
				<DialogActions className="dialog-actions">
					<button className="close-btn btn" onClick={() => setShowNewLineupForm(false)}>Close</button>
					<button className="submit-btn btn" onClick={() => submitNewLineupForm()}>Submit</button>
				</DialogActions>
				</Dialog>

				<ImportLineupsDialog showImportDialog={showImportDialog} onClose={closeImportDialog} />

				<DeleteLineupsDialog showDeleteLineupsDialog={showDeleteLineupsDialog} 
					onClose={() => setShowDeleteLineupsDialog(false)} 
					lineupsToDelete={selectedLineups} 
					deleteLineups={() => deleteSelectedLineups(selectedLineups)} />

				{ stateFilter === "past" &&
				<div className="lineups-wrapper container">
					<LineupsTable
						selectedLineups={selectedLineups}
						setSelectedLineups={setSelectedLineups} 
						lineups={lineups.filter(lineup => {
							// const currentTime = new Date()
							// const timeConv = "" + currentTime.getFullYear() + "-" + currentTime.getMonth() + "-" + currentTime.getDay()
							// console.log(t)
							return Date.parse(lineup["minStartTime"].split("T")[0]) <= new Date()
						})} /> 
				</div>
				}	
		  	</> 
		 : 
		 	<div className="loading-screen">
		 		<h3><Roller />Loading lineups</h3>
		  </div>}
	</div>
  )
}

export default LineupsPage


// DEPRECATED CODE
 	// const loadGraphData = () => {
 	// 	setLoadingPointsGraph(true)
 	// 	setLoadingBankrollGraph(true)
 	// 	var data = []
 	// 	var bankRollSum = 0
 	// 	var lineups_copy = [...lineups]
 	// 	var max_percentile = 0
 	// 	var max_points = 0
 	// 	var max_win = 0
 	// 	lineups_copy.reverse()

 	// 	lineups_copy.length > 0 && lineups_copy.map((lineup) => {
 	// 		if (filteredYears == null || filteredYears == lineup.year) {
	//  			bankRollSum += (lineup.winnings - lineup.bet)
	//  			var week_string = `${lineup.year}/${lineup.week}`
	//  			var sameWeeks =  data.filter(week => week.week === week_string)
	//  			max_points = Math.max(max_points, lineup.points)
	//  			max_win = Math.max(max_win, lineup.winnings - lineup.bet)
	//  			max_percentile = Math.max(max_percentile, lineup.percentile)
	//  			if (sameWeeks.length > 0) {
	//  				sameWeeks[0]["bankroll"] = bankRollSum
	//  				sameWeeks[0]["points"] = (sameWeeks[0]["points"] * sameWeeks[0]["lineup_count"] + lineup.points) / (sameWeeks[0]["lineup_count"] + 1)
	//  				sameWeeks[0]["lineup_count"] += 1
	//  				if (data.length > 1) {
	//  					sameWeeks[0]["points_change"] = sameWeeks[0]["points"] - data[data.length - 2]["points"]
	//  					sameWeeks[0]["bankroll_change"] = bankRollSum - data[data.length - 2]["bankroll"]
	//  				}
	//  			} else {
	// 	 			var lineup_data = {}
	// 	 			lineup_data["points"] = lineup.points
	// 	 			lineup_data["lineup_count"] = 1
	// 	 			lineup_data["bankroll"] = bankRollSum
	// 	 			lineup_data["week"] = week_string
	// 	 			if (data.length > 0) {
	// 	 				lineup_data["points_change"] = (lineup.points - data[data.length - 1]["points"])
	// 	 				lineup_data["bankroll_change"] = (bankRollSum - data[data.length - 1]["bankroll"])
	// 	 			}
	// 	 			data.push(lineup_data)
	// 	 		}
	// 	 	}
	// 	 	setLineupCount(data.length)
	// 	 	setHighestWin(max_win)
	// 	 	setMaxScore(max_points)
	// 	 	setHighestPercentile(max_percentile)
	//  	})	

	// 	setPointsGraphData(data)
	// 	setBankrollGraphData(data)
	// 	setLoadingPointsGraph(false)
	// 	setLoadingBankrollGraph(false)
 	// }

	//  const getExtras = () => {
	// 	setLineupCount(lineups.length)
	// 	const a = Math.max(...lineups.map(lineup => (lineup.winnings - lineup.bet)))
	// 	setHighestWin(a)
	// 	const b = Math.max(...lineups.map(lineup => (lineup.percentile)))
	// 	setHighestPercentile(b)
	// 	const c = Math.max(...lineups.map(lineup => (lineup.points)))
	// 	setMaxScore(c)
	// }