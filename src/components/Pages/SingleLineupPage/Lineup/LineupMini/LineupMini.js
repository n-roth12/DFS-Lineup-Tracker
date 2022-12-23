import LineupPlayerMini from '../LineupPlayerMini/LineupPlayerMini'
import EmptyPlayerMini from '../EmptyPlayerMini/EmptyPlayerMini'
import './LineupMini.scss'
import { useState, useEffect } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { GrRevert } from 'react-icons/gr'

const LineupMini = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, onOpenDialog, toggleEditingPos, setSwapPlayer, playerDialogWrapper, draftGroup, setAlertMessage, onSave }) => {

  const [lineupSalary, setLineupSalary] = useState()
  const [teamProjectedPoints, setTeamProjectedPoints] = useState(0)
  const [remainingSalary, setRemainingSalary] = useState(0)

  const checkBeingEdited = (pos) => {
    return editingPos && (pos === editingPos["position"]) && (editingPos["lineup"] == lineup["lineupId"])
  }

  const toggleEditingPosWrapper = (pos) => {
    toggleEditingPos({ "lineup": lineup["lineupId"], "position": pos })
  }

  const getTeamProjPoints = () => {
    var projectedPoints = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        projectedPoints += parseFloat(lineupSlot["fppg"])
      }
    }
    setTeamProjectedPoints(parseFloat(projectedPoints).toFixed(2))
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
        "lineup": lineup,
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

  useEffect(() => {
    getSalary()
  }, [])

  const getSalary = () => {
    var salary = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        salary += lineupSlot["salary"]
      }
    }
    setLineupSalary(salary)
  }

  return (
    <div className="lineup-mini">
        <div className='lineup-mini-header'>
            <div className='header-upper'>
                <p>Salary: ${lineup["salary"]}</p>
                <p>Proj: {lineup["projectedPoints"]} Pts</p>
            </div>
            <div className='header-lower'>
              <button className='revert-btn'>Revert <GrRevert /></button>
              <button className='save-btn' onClick={saveLineup} >Save</button>
              <button className='edit-btn'>Details <FaAngleRight /></button>
            </div>
        </div>
        {lineup["lineup"]["qb"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["qb"]} 
            position={'qb'} 
            beingEdited={checkBeingEdited('qb')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'qb'} 
            position={'qb'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('qb')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["rb1"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["rb1"]} 
            position={'rb1'} 
            beingEdited={checkBeingEdited('rb1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'rb1'} 
            position={'rb1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["rb2"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["rb2"]} 
            position={'rb2'} 
            beingEdited={checkBeingEdited('rb2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'rb2'} 
            position={'rb2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["wr1"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["wr1"]} 
            position={'wr1'} 
            beingEdited={checkBeingEdited('wr1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'wr1'} 
            position={'wr1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["wr2"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["wr2"]} 
            position={'wr2'} 
            beingEdited={checkBeingEdited('wr2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'wr2'} 
            position={'wr2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["wr3"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["wr3"]} 
            position={'wr3'} 
            beingEdited={checkBeingEdited('wr3')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'wr3'} 
            position={'wr3'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr3')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["te"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["te"]} 
            position={'te'} 
            beingEdited={checkBeingEdited('te')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'te'} 
            position={'te'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('te')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["flex"] !== null ? 
          <LineupPlayerMini
            player={lineup["lineup"]["flex"]} 
            position={'flex'} 
            beingEdited={checkBeingEdited('flex')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} /> 
        : <EmptyPlayerMini
            key={'flex'} 
            position={'flex'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('flex')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} />
        }
        {lineup["lineup"]["dst"] !== null ?
          <LineupPlayerMini
            player={lineup["lineup"]["dst"]}
            position={'dst'}
            beingEdited={checkBeingEdited('dst')}
            onDelete={onDelete}
            onAdd={onAdd}
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos}
            playerDialogWrapper={playerDialogWrapper} />
        : <EmptyPlayerMini
            key={'dst'}
            position={'dst'}
            onAdd={onAdd}
            beingEdited={checkBeingEdited('dst')}
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPosWrapper}
            editingPos={editingPos} /> 
        }
    </div>     
  )
}

export default LineupMini