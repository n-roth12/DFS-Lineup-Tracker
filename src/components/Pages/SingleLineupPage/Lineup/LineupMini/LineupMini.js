import LineupPlayerMini from '../LineupPlayerMini/LineupPlayerMini'
import EmptyPlayerMini from '../EmptyPlayerMini/EmptyPlayerMini'
import './LineupMini.scss'
import { useState, useEffect } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { GrRevert } from 'react-icons/gr'

const LineupMini = ({ lineup, onAdd, editingPos, cancelEdit, onOpenDialog, toggleEditingPos, setSwapPlayer, playerDialogWrapper, draftGroup, setAlertMessage, onSave, onDelete }) => {

  const [lineupSalary, setLineupSalary] = useState()
  const [teamProjectedPoints, setTeamProjectedPoints] = useState(0)
  const [remainingSalary, setRemainingSalary] = useState(0)

  useEffect(() => {
    getSalary()
  }, [])

  const checkBeingEdited = (pos) => {
    return editingPos && (pos === editingPos["position"]) && (editingPos["lineup"] == lineup["lineupId"])
  }

  const toggleEditingPosWrapper = (pos) => {
    toggleEditingPos({ "lineup": lineup["lineupId"], "position": pos })
  }

  const getTeamProjPoints = () => {
    var projectedPoints = 0
    for (const [k,  lineupSlot] of Object.entries(lineup["lineup"])) {
      if (lineupSlot !== null) {
        projectedPoints += parseFloat(lineupSlot["fppg"])
      }
    }
    return parseFloat(projectedPoints).toFixed(2)
  }

  const getRemainingSalary = () => {
    if (draftGroup) {
      var remaining = draftGroup["salaryCap"]
      for (const [k,  lineupSlot] of Object.entries(lineup)) {
        if (lineupSlot !== null) {
          remaining -= lineupSlot["salary"]
        }
      }
      setRemainingSalary(remaining)
    }
  }

  const saveLineup = async () => {
    const projectedPoints = getTeamProjPoints()
    const res = await fetch(`/lineups/updateLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "lineup": lineup["lineup"],
        "draftGroupId": lineup["draftGroupId"],
        "lineupId": lineup["lineupId"],
        "salary": draftGroup["salaryCap"] - remainingSalary,
        "projectedPoints": teamProjectedPoints,
        "projectedOwn": 120,
        "startTime": draftGroup["startTime"],
        "endTime": draftGroup["endTime"],
        "startTimeSuffix": draftGroup["startTimeSuffix"],
        "site": draftGroup["site"],
        "salaryCap": draftGroup["salaryCap"]
      })
    })
    .then(() => {
      if (remainingSalary < 0) {
        setAlertMessage("Lineup Saved with Warning: Lineup over the salary cap!")
      } else {
        setAlertMessage("Lineup Saved")
      }    
    })
    .catch((error) => {
      setAlertMessage("Error while saving lineup!")
    })
    onSave(lineup["lineupId"])
  }

  const getSalary = () => {
    var salary = 0
    for (const [k,  lineupSlot] of Object.entries(lineup["lineup"])) {
      if (lineupSlot !== null) {
        salary += lineupSlot["salary"]
      }
    }
    return salary
  }

  const onDeleteWrapper = (pos) => {
    onDelete(lineup["lineupId"], pos)
  }

  return (
    <div className="lineup-mini">
        <div className='lineup-mini-header'>
            <div className='header-upper'>
                <p>Salary: {getSalary()}</p>
                <p>Proj: {getTeamProjPoints()} Pts</p>
            </div>
            <div className='header-lower'>
              <button className='revert-btn'>Revert <GrRevert /></button>
              <button className='save-btn' onClick={saveLineup} >Save</button>
              <button className='edit-btn'>Details <FaAngleRight /></button>
            </div>
        </div>
        {Object.keys(lineup["lineup"]).map((pos) => 
          lineup["lineup"][pos] !== null ?
            <LineupPlayerMini
              player={lineup["lineup"][pos]}
              position={pos}
              beingEdited={checkBeingEdited(pos)}
              onDelete={onDeleteWrapper}
              onAdd={onAdd}
              onOpenDialog={onOpenDialog}
              toggleEditingPos={toggleEditingPosWrapper}
              editingPos={editingPos}
              playerDialogWrapper={playerDialogWrapper}
            />
          :
            <EmptyPlayerMini
              position={pos}
              onAdd={onAdd}
              beingEdited={checkBeingEdited(pos)}
              cancelEdit={cancelEdit}
              toggleEditingPos={toggleEditingPosWrapper}
              editingPos={editingPos}              
            />
        )}
    </div>     
  )
}

export default LineupMini