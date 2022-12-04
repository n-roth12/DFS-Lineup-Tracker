import { useState, useEffect } from 'react'
import './CreateLineupDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaAngleRight } from 'react-icons/fa';
import { BiExport, BiTrash, BiDownload } from 'react-icons/bi'
import { capitalize } from '@material-ui/core';

const CreateLineupDialog = ({ showCreateLineupDialog, onClose, draftGroup }) => {
  const [lineups, setLineups] = useState([])
  const [selectedLineups, setSelectedLineups] = useState([])
  const [file, setFile] = useState(null)
  const [lineupsLoading, setLineupsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (draftGroup && Object.keys(draftGroup).length > 0) {
      getLineups()
    }
  }, [draftGroup])

  const getLineups = async () => {
    setLineupsLoading(true)
    const res = await fetch(`/users/lineups/draftGroup?draftGroup=${draftGroup["draftGroupId"]}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    console.log(data)
    setLineups(data)
    setLineupsLoading(false)
  }

  const exportLineups = async () => {
    const lineupsToExport = lineups.filter((lineup) => selectedLineups.includes(lineup["lineup-id"]))
    const res = await fetch(`/lineups/export`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify(lineupsToExport)
    })
    const data = await res.blob()
    downloadFile(data)
  }

  const downloadFile = (blob) => {
    const url = window.URL.createObjectURL(blob)
    setFile(url)
    setSelectedLineups([])
  }

  const deleteLineups = () => {
    console.log(selectedLineups)
  }

  const toggleSelectAllLineups = () => {
    setFile(null)
    if (selectedLineups.length > 0) {
      setSelectedLineups([])
    } else {
      setSelectedLineups(lineups.map((lineup) => {
        return lineup["lineup-id"]  
      }))
    }
  }

  const toggleSelectedLineup = (lineupId) => {
    setFile(null)
    if (!selectedLineups.includes(lineupId)) {
      setSelectedLineups(selectedLineups.concat(lineupId))
    } else {
      setSelectedLineups(selectedLineups.filter((lineup_id) => lineup_id !== lineupId))
    }
  }

  const createLineup = async () => {
    const res = await fetch(`/lineups/createEmptyLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroup["draftGroupId"],
        "startTime": draftGroup["startTime"],
        "endTime": draftGroup["endTime"],
        "site": draftGroup["site"],
        "startTimeSuffix": draftGroup["startTimeSuffix"]
      })
    })
    const data = await res.json()
    return data["lineupId"]
  }

  const createLineupWrapper = async () => {
    const lineupId = await createLineup()
    onClose()
    navigate(`/createLineup/${draftGroup["draftGroupId"]}/${lineupId}`)
  }

  const closeDialog = () => {
    setFile(null)
    setLineups([])
    setSelectedLineups([])
    onClose()
  }

  return (
    <Dialog open={showCreateLineupDialog} className="create-lineup-dialog" fullWidth maxWidth="md">
      {draftGroup && draftGroup["games"] &&
      <>
        <DialogTitle className="title">
          <div className='title-inner'>
            <p className='title-upper'>{draftGroup["startTimeSuffix"] && draftGroup["startTimeSuffix"].replace('(', '').replace(')', '')} ({capitalize(draftGroup["site"])})</p>
            <FaTimes className='close-btn' onClick={closeDialog}/>
          </div>
          <p className='title-lower'>{draftGroup["startTime"] && "Start Time: " + draftGroup["startTime"].split("T")[0] + draftGroup["startTime"].split("T")[1]}</p>
        </DialogTitle>
        <DialogContent className="content">
          <div className='content-inner'>
            <div className="games">
              <h3>{draftGroup["games"].length} Games</h3>
              {draftGroup["games"].length > 0 &&
                draftGroup["games"].map((game) => 
                <div className="game">
                  <p>{game["awayTeam"]} @ {game["homeTeam"]}</p>
                  <p>{game["startTime"] && game["startTime"].split("T")[0]}</p>
                </div>
                )
              }
            </div>
            <div className="user-lineups">
              <h3>Your Lineups ({lineups.length})</h3>
              <table className='lineups-table'>
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={selectedLineups.length === lineups.length} onChange={toggleSelectAllLineups} /></th>
                    <th></th>
                    <th>Title</th>
                    <th>Salary</th>
                    <th>Proj. Pts</th>
                  </tr>
                </thead>
                <tbody>
                {lineupsLoading ?
                  <tr><td colSpan={5}><h3 className='loading'>Loading...</h3></td></tr>
                :
                lineups.length > 0 ?
                  lineups.map((lineup) => 
                    <tr className='user-lineup'>
                      <input type="checkbox" checked={selectedLineups.includes(lineup["lineupId"])} onClick={() => toggleSelectedLineup(lineup["lineupId"])}></input>
                      <td><Link className='lineup-link' to={`/createLineup/${lineup["draftGroupId"]}/${lineup["lineupId"]}`}>Edit <FaAngleRight /></Link></td>
                      <td>Untitled</td>
                      <td>{lineup["salary"]}</td>
                      <td>{lineup["projectedPoints"]}</td>
                    </tr>
                  )
                :
                  <tr><td colSpan={5}><h3>No Lineups Created</h3></td></tr>
                }
              
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
        <DialogActions className='actions'>
          {file !== null &&
            <a className='download-btn' href={file} download={`lineups_${draftGroup["draftGroupId"]}.csv`}>lineups_{draftGroup["draftGroupId"]}.csv <BiDownload className='download-icon'/></a>
          }
          {selectedLineups.length > 0 &&
            <>
              <button className='delete-btn' onClick={deleteLineups}>Delete <BiTrash className='trash-icon' /></button>
              <button className='export-btn' onClick={exportLineups}>Export CSV <BiExport className='export-icon'/></button>
            </>
          }
          <button className="create-btn" onClick={() => createLineupWrapper()}>New Lineup</button>
        </DialogActions>
      </>
      }
    </Dialog>
  )
}

export default CreateLineupDialog
