import { useState, useEffect } from 'react'
import './CreateLineupDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaAngleRight } from 'react-icons/fa';
import { BiTrash, BiDownload } from 'react-icons/bi'
import { capitalize, Tooltip } from '@material-ui/core';
import { api_url } from '../../../Constants';
import { FiMinusSquare, FiSquare } from 'react-icons/fi';
import { AiOutlineExport } from 'react-icons/ai';

const CreateLineupDialog = ({ showCreateLineupDialog, onClose, draftGroup }) => {
  const [lineups, setLineups] = useState([])
  const [selectedLineups, setSelectedLineups] = useState([])
  const [file, setFile] = useState(null)
  const [lineupsLoading, setLineupsLoading] = useState(false)
  const [showConfirmDeleteLineups, setShowConfirmDeleteLineups] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (draftGroup && Object.keys(draftGroup).length > 0) {
      getLineups()
    }
  }, [draftGroup])

  const getLineups = async () => {
    setLineupsLoading(true)
    const res = await fetch(`${api_url}/users/lineups/draftGroup?draftGroup=${draftGroup["draftGroupId"]}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setLineups(data)
    setLineupsLoading(false)
  }

  const exportLineups = async () => {
    const res = await fetch(`${api_url}/lineups/export`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify(lineups.filter((lineup) =>
        selectedLineups.includes(lineup["lineupId"])).map((lineup) => lineup["lineup"]))
    })
    const data = await res.blob()
    downloadFile(data)
  }

  const downloadFile = (blob) => {
    const url = window.URL.createObjectURL(blob)
    setFile(url)
    setSelectedLineups([])
  }

  const deleteSelectedLineups = async () => {
    const res = await fetch(`${api_url}/lineups/delete`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: selectedLineups
    })
    const data = await res.json()
    console.log(data)
  }

  const selectAllLineups = () => {
    setFile(null)
    setSelectedLineups(lineups.map((lineup) => {
      return lineup["lineupId"]
    }))
  }

  const deselectAllLineups = () => {
    setSelectedLineups([])
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
    const res = await fetch(`${api_url}/lineups/createEmptyLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroup["draftGroupId"],
        "startTime": draftGroup["startTime"],
        "endTime": draftGroup["endTime"],
        "site": draftGroup["site"],
        "startTimeSuffix": draftGroup["startTimeSuffix"],
        "salaryCap": draftGroup["salaryCap"]
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
    setShowConfirmDeleteLineups(false)
    onClose()
  }

  return (
    <Dialog open={showCreateLineupDialog} className="create-lineup-dialog" fullWidth maxWidth="md">
      {draftGroup && draftGroup["games"] &&
        <>
          <DialogTitle className="title">
            <div className='title-inner'>
              <p className='title-upper'>{draftGroup["startTimeSuffix"] && draftGroup["startTimeSuffix"].replace('(', '').replace(')', '')} ({capitalize(draftGroup["site"])})</p>
              <FaTimes className='close-btn' onClick={closeDialog} />
            </div>
            <p className='title-lower'>{draftGroup["startTime"] && "Start Time: " + draftGroup["startTime"].split("T")[0] + draftGroup["startTime"].split("T")[1]}</p>
          </DialogTitle>
          <DialogContent className="content">
            <div className='content-inner'>
              <div className="games">
                <h3>{draftGroup["games"].length} Games</h3>
                <div className='games-inner'>
                  {draftGroup["games"].length > 0 &&
                    draftGroup["games"].map((game) =>
                      <div className="game">
                        <p>{game["awayTeam"]} @ {game["homeTeam"]}</p>
                        <p>{game["startTime"] && game["startTime"].split("T")[0]}</p>
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="user-lineups">
                <h3>{lineups.length} Lineup{lineups?.length > 1 ? "s" : ""} for this Slate</h3>
                <div className='user-lineups-inner'>
                  <table className='lineups-table'>
                    <thead>
                      <tr>
                        <th>
                          {!selectedLineups.length > 0 ?
                            <Tooltip title="Select All">
                              <button className='lineup-options-btn' onClick={selectAllLineups}><FiSquare className='icon' /></button>
                            </Tooltip>
                            :
                            <Tooltip title="De-select All">
                              <button className='lineup-options-btn' onClick={deselectAllLineups} ><FiMinusSquare className='icon' /></button>
                            </Tooltip>
                          }
                        </th>
                        <th></th>
                        <th>Salary</th>
                        <th>Projection</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineupsLoading ?
                        <tr><td colSpan={5}><h3 className='loading'>Loading...</h3></td></tr>
                        :
                        lineups.length > 0 ?
                          lineups.map((lineup) =>
                            <tr className='user-lineup'>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedLineups.includes(lineup["lineupId"])}
                                  onClick={() => toggleSelectedLineup(lineup["lineupId"])}>
                                </input>
                              </td>
                              <td><Link className='lineup-link' to={`/createLineup/${lineup["draftGroupId"]}/${lineup["lineupId"]}`}>Edit <FaAngleRight /></Link></td>
                              <td>${lineup["salary"]}</td>
                              <td>{lineup["projectedPoints"]} PTS</td>
                            </tr>
                          )
                          :
                          <tr><td colSpan={5}><h3>No Lineups Created</h3></td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className='actions'>
            {file !== null &&
              <a className='download-btn' href={file} download={`lineups_${draftGroup["draftGroupId"]}.csv`}>lineups_{draftGroup["draftGroupId"]}.csv <BiDownload className='download-icon' /></a>
            }
            {selectedLineups.length > 0 && !showConfirmDeleteLineups &&
              <>
                <p className='selected-counter' >{selectedLineups.length} Selected</p>
                <button className='delete-btn' onClick={() => setShowConfirmDeleteLineups(true)}>Delete <BiTrash className='trash-icon' /></button>
                <button className='export-btn' onClick={exportLineups}>Export <AiOutlineExport className='export-icon' /></button>
              </>
            }
            {showConfirmDeleteLineups ?
              <div className='confirm-delete-wrapper'>
                <p>Delete {selectedLineups.length} Lineups?</p>
                <button className='cancel-btn' onClick={() => setShowConfirmDeleteLineups(false)}>Cancel</button>
                <button className='confirm-btn' onClick={deleteSelectedLineups}>Delete</button>
              </div>
              :
              <button className="create-btn" onClick={() => createLineupWrapper()}>New Lineup</button>
            }
          </DialogActions>
        </>
      }
    </Dialog>
  )
}

export default CreateLineupDialog
