import LineupPlayerNew from './LineupPlayer/LineupPlayer'
import EmptyPlayer from './EmptyPlayer/EmptyPlayer'
import './Lineup.scss'
import useResponsiveBreakpoints from '../../../../useResponsiveBreakpoints'
import { useState, useEffect, useRef } from 'react'

const Lineup = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog, toggleEditingPos, setPlayerDialogContent }) => {
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [lineupOrder, setLineupOrder] = useState(["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"])
  const [orderedPositions, setOrderedPositions] = useState([])
  const targetRef = useRef(null)
  const size = useResponsiveBreakpoints(targetRef, [
    { small: 400 },
    { large: 600 }
  ])

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
    <div className={`lineup ${size}`} ref={targetRef}>
      {lineup && Object.keys(lineup).length > 0 && orderedPositions.length > 0 &&
        orderedPositions.map(position => 
          lineup[position] !== null ? 
            <LineupPlayerNew 
              player={lineup[position]} 
              position={position} 
              beingEdited={checkBeingEdited(position)} 
              onDelete={onDelete} 
              onAdd={onAdd} 
              onOpenDialog={onOpenDialog}
              toggleEditingPos={toggleEditingPos}
              editingPos={editingPos}
              setPlayerDialogContent={setPlayerDialogContent} /> 
          : 
            <EmptyPlayer 
              key={position} 
              position={position} 
              onAdd={onAdd} 
              beingEdited={checkBeingEdited(position)} 
              cancelEdit={cancelEdit}
              toggleEditingPos={toggleEditingPos}
              editingPos={editingPos} />
        )
      }
    </div>
  )
}

export default Lineup