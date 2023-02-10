import LineupPlayerNew from '../../../LineupPlayerNewV2/LineupPlayerNewV2'
import EmptyPlayer from './EmptyPlayer/EmptyPlayer'
import './Lineup.scss'
import { useState, useEffect } from 'react'

const Lineup = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog, toggleEditingPos, setPlayerDialogContent }) => {
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)

  const checkBeingEdited = (pos) => {
    return pos === editingPos
  }

  return (
    <div className="lineup">
      {lineup && Object.keys(lineup).length > 0 && 
        Object.keys(lineup).map(position => 
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
        : <EmptyPlayer 
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