import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LineupsPage.scss'
import '../../../DefaultTable.scss'
import LineupsTable from '../../TablesLists/LineupsTable/LineupsTable'
import ImportLineupsDialog from '../../Dialogs/ImportLineupsDialog/ImportLineupsDialog'
import DeleteLineupsDialog from '../../Dialogs/DeleteLineupsDialog/DeleteLineupsDialog'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog'
import PointsGraph from '../LineupsPage/PointsGraph/PointsGraph'
import { Roller } from 'react-awesome-spinners'
import { FaAngleRight, FaAngleDown, FaAngleUp, FaTimes, FaFire, FaSnowflake, FaPlus, FaUpload, FaFileImport } from 'react-icons/fa'
import { BiImport } from 'react-icons/bi'
import { api_url } from '../../../Constants'

const LineupsPage = ({ setAlertMessage, setAlertColor, setAlertTime }) => {

	const [lineups, setLineups] = useState([])
	const [loadingLineups, setLoadingLineups] = useState(true)
	const [years, setYears] = useState([])
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [selectedLineups, setSelectedLineups] = useState([])
	const [showDeleteLineupsDialog, setShowDeleteLineupsDialog] = useState(false)
	const [stateFilter, setStateFilter] = useState("past")
	const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
	const [dialogDraftGroup, setDialogDraftGroup] = useState()
	const [dialogDraftGroupLineups, setDialogDraftGroupLineups] = useState([])

  useEffect(() => {
  	loadPage()
  }, [])

  const loadPage = async () => {
	setAlertMessage("Notice: For testing purposes, the site is functioning as though it is still Week 18, 2021, due to the NFL being in offseason.")
	setAlertColor("blue")
	setAlertTime(400000)
  	await getUserLineups()
  }

  const getUserLineups = async () => {
	const res = await fetch(`${api_url}/users/lineups`, {
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
        const res = await fetch(`${api_url}/lineups/upload`, {
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

	const changeStateFilter = (state) => {
		setSelectedLineups([])
		setStateFilter(state)
	}

	const deleteSelectedLineups = async (lineupsToDelete) => {
		console.log(lineupsToDelete)
		const res = await fetch(`${api_url}/lineups/delete`, {
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
	  	const res = await fetch(`${api_url}/lineups`, {
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

  return (
  	<div className="lineups-page page">
		<div className='lineup-wrapper' >
			<div className='filter-btn-wrapper'>
				<button onClick={() => changeStateFilter("upcoming")} className={`underline-btn${stateFilter === "upcoming" ? " active" : ""}`}>Upcoming</button>
				<button onClick={() => changeStateFilter("live")} className={`underline-btn${stateFilter === "live" ? " active" : ""}`}>Live</button>
				<button onClick={() => changeStateFilter("past")} className={`underline-btn${stateFilter === "past" ? " active" : ""}`}>History</button>
			</div>
		</div>
		<CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog} 
				onClose={() => setShowCreateLineupDialog(false)} draftGroup={dialogDraftGroup} draftGroupLineups={dialogDraftGroupLineups} />
  		{!loadingLineups && lineups ?
  			<div className='container'>
				<ImportLineupsDialog showImportDialog={showImportDialog} onClose={closeImportDialog} />

				<DeleteLineupsDialog showDeleteLineupsDialog={showDeleteLineupsDialog} 
					onClose={() => setShowDeleteLineupsDialog(false)} 
					lineupsToDelete={selectedLineups} 
					deleteLineups={() => deleteSelectedLineups(selectedLineups)} />
				{stateFilter === "past" &&
				<>
						<LineupsTable
							selectedLineups={selectedLineups}
							setSelectedLineups={setSelectedLineups} 
							stateFilter={stateFilter}
							setShowImportLineupDialog={setShowImportDialog}
							lineups={lineups.length > 0 ? lineups.filter(lineup => {
								return Date.parse(lineup["startTime"].split("T")[0]) <= Date.parse(new Date("2022-12-30T06:00:00"))
							}) : []} /> 
				</>
				}
				{stateFilter === "live" &&
				<>
						<LineupsTable
							selectedLineups={selectedLineups}
							setSelectedLineups={setSelectedLineups}
							stateFilter={stateFilter}
							setShowImportLineupDialog={setShowImportDialog}
							lineups={lineups.length > 0 ? lineups.filter((lineup) => {
								return Date.parse(lineup["startTime"].split("T")[0]) > Date.parse(new Date())
									&& lineup["endTime"] && Date.parse(lineup["endTime"].split("T")[0]) < Date.parse(new Date("2022-12-30T06:00:00"))
						}) : []} />
				</>
				}
				{stateFilter === "upcoming" &&
				<>
						<LineupsTable
							selectedLineups={selectedLineups}
							setSelectedLineups={setSelectedLineups}
							stateFilter={stateFilter}
							setShowImportLineupDialog={setShowImportDialog}
							lineups={lineups.length > 0 ? lineups.filter((lineup) => {
								return Date.parse(lineup["startTime"].split("T")[0]) > Date.parse(new Date("2022-12-30T06:00:00"))
							}) : []}
						/>
				</>
				}
		  	</div> 
		: 
		 	<div className="loading-screen">
		 		<h3><Roller /></h3>
		  	</div>
		}
	</div>
  )
}

export default LineupsPage
