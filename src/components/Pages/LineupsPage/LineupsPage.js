import { useState, useEffect } from 'react'
import './LineupsPage.scss'
import '../../../DefaultTable.scss'
import LineupsTable from '../../TablesLists/LineupsTable/LineupsTable'
import ImportLineupsDialog from '../../Dialogs/ImportLineupsDialog/ImportLineupsDialog'
import DeleteLineupsDialog from '../../Dialogs/DeleteLineupsDialog/DeleteLineupsDialog'
import CreateLineupDialog from '../../Dialogs/CreateLineupDialog/CreateLineupDialog'
import PleaseLogin from './PleaseLogin/PleaseLogin'
import { Roller } from 'react-awesome-spinners'
import { api_url } from '../../../Constants'

const LineupsPage = ({ setAlertMessage, setAlertColor, setAlertTime }) => {

	const [lineups, setLineups] = useState([])
	const [loadingLineups, setLoadingLineups] = useState(true)
	const [years, setYears] = useState([])
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [selectedLineups, setSelectedLineups] = useState([])
	const [showDeleteLineupsDialog, setShowDeleteLineupsDialog] = useState(false)
	const [showCreateLineupDialog, setShowCreateLineupDialog] = useState(false)
	const [dialogDraftGroup, setDialogDraftGroup] = useState()
	const [dialogDraftGroupLineups, setDialogDraftGroupLineups] = useState([])
	const [isGuest, setIsGuest] = useState(false)

	useEffect(() => {
		if (sessionStorage.dfsTrackerToken) {
			loadPage()
		} else {
			setIsGuest(true)
		}
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

	return (
		<div className="lineups-page page">
			<CreateLineupDialog showCreateLineupDialog={showCreateLineupDialog}
				onClose={() => setShowCreateLineupDialog(false)} draftGroup={dialogDraftGroup} draftGroupLineups={dialogDraftGroupLineups} />
			{isGuest ?
				<PleaseLogin message={"save and edit lineups."} />
			:
			<>
			{!loadingLineups && lineups ?
				<div className='container'>
					<ImportLineupsDialog showImportDialog={showImportDialog} onClose={closeImportDialog} />

					<DeleteLineupsDialog showDeleteLineupsDialog={showDeleteLineupsDialog}
						onClose={() => setShowDeleteLineupsDialog(false)}
						lineupsToDelete={selectedLineups}
						deleteLineups={() => deleteSelectedLineups(selectedLineups)} />
							<LineupsTable
								selectedLineups={selectedLineups}
								setSelectedLineups={setSelectedLineups}
								setShowImportLineupDialog={setShowImportDialog}
								lineups={lineups.length > 0 ? lineups.filter((lineup) => {
									return Date.parse(lineup["startTime"].split("T")[0]) > Date.parse(new Date("2022-12-30T06:00:00"))
								}) : []}
							/>
				</div>
				:
				<div className="loading-screen">
					<h3><Roller /></h3>
				</div>
			}
			</>
}
		</div>
	)
}

export default LineupsPage
