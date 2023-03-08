import PastLineupPlayer from '../PastLineupPlayer/PastLineupPlayer'
import PastEmptyPlayer from '../PastEmptyPlayer/PastEmptyPlayer'
import './PastLineup.scss'
import { useState, useEffect } from 'react'

const PastLineup = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog, toggleEditingPos, setPlayerDialogContent, showEditing }) => {
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [lineupOrder, setLineupOrder] = useState(["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"])
  const [orderedPositions, setOrderedPositions] = useState([])

  useEffect(() => {
    if (lineup !== null && Object.keys(lineup).length > 0) {
      setOrderedPositions([...Object.keys(lineup).sort((a, b) =>
        lineupOrder.indexOf(a.toUpperCase()) - lineupOrder.indexOf(b.toUpperCase())
      )])
    }
  }, [])


  const checkBeingEdited = (pos) => {
    return pos === editingPos
  }

  return (
    <div className="past-lineup">
      {lineup && Object.keys(lineup).length > 0 && orderedPositions.length > 0 &&
        orderedPositions.map(position =>
          lineup[position] !== null ?
            <PastLineupPlayer
              player={lineup[position]}
              position={position}
              beingEdited={checkBeingEdited(position)}
              onDelete={onDelete}
              onAdd={onAdd}
              onOpenDialog={onOpenDialog}
              toggleEditingPos={toggleEditingPos}
              editingPos={editingPos}
              setPlayerDialogContent={setPlayerDialogContent} 
              showEditing={showEditing}/>
            : <PastEmptyPlayer
              key={position}
              position={position}
              onAdd={onAdd}
              beingEdited={checkBeingEdited(position)}
              cancelEdit={cancelEdit}
              toggleEditingPos={toggleEditingPos}
              editingPos={editingPos}
              showEditing={showEditing} />
        )
      }
    </div>
  )
}

export default PastLineup