import { useState, useEffect } from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import './CreateLineupDialog.scss'
import { Link, useNavigate } from 'react-router-dom';

const CreateLineupDialog = ({ showCreateLineupDialog, onClose, slate }) => {

  const [lineups, setLineups] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (slate && Object.keys(slate).length > 0) {
      getLineups()
    }
  }, [slate])

  const getLineups = async () => {
    const res = await fetch(`/lineups_new?draftGroup=${slate["draftGroupId"]}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setLineups(data)
  }

  const exportLineups = () => {
    return 
  }

  const createLineup = async (draftGroupId) => {
    const res = await fetch(`/lineups/createEmptyLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draft-group": draftGroupId
      })
    })
    const data = await res.json()
    console.log(data["lineupId"])
    return data["lineupId"]
  }

  const createLineupWrapper = async (draftGroupId) => {
    const lineupId = await createLineup(draftGroupId)
    onClose()
    navigate(`/createLineup/${draftGroupId}/${lineupId}`)

  }

  return (
    <Dialog open={showCreateLineupDialog} className="create-lineup-dialog" fullWidth maxWidth="md">
      {slate && slate["games"] &&
      <>
          <DialogTitle className="title">
            <p className='title-upper'>{slate["minStartTime"].split("T")[0]} ({slate["draftGroupState"]})</p>
            <p className='title-lower'>Start Time: {slate["minStartTime"].split("T")[1]}</p>
          </DialogTitle>
          <DialogContent className="content">
            <div className='content-inner'>
              <div className="games">
                <h3>{slate["games"].length} Games</h3>
                {slate["games"].length > 0 &&
                  slate["games"].map((game) => 
                  <div className="game">
                    <p>{game["description"]}</p>
                    <p>{game["startDate"].split("T")[0]}</p>
                  </div>
                  )
                }
              </div>
              <div className="user-lineups">
                <h3>Your Lineups ({lineups.length})</h3>
                <table className='lineups-table'>
                  <thead>
                    <th></th>
                    <th>Title</th>
                    <th>Salary</th>
                    <th>Proj. Pts</th>
                  </thead>
                  <tbody>
                  {lineups.length > 0 ?
                    lineups.map((lineup) => 
                      <tr className='user-lineup'>
                        <td><Link className='lineup-link' to={`/createLineup/${lineup["draft-group"]}/${lineup["lineup-id"]}`}>Edit</Link></td>
                        <td>Untitled</td>
                        <td>$59000</td>
                        <td>159.09</td>
                      </tr>
                    )
                  :
                    <p>No Lineups Created</p>
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
          <DialogActions className='actions'>
            <button className="close-btn" onClick={onClose}>Close</button>
            <button className='export-btn' onClick={exportLineups}>Export CSV</button>
            <button className="create-btn" onClick={() => createLineupWrapper(slate["draftGroupId"])}>New Lineup</button>
          </DialogActions>
      </>
      }
    </Dialog>
  )
}

export default CreateLineupDialog