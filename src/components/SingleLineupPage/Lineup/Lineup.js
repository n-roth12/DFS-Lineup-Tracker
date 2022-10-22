import LineupPlayer from './LineupPlayer/LineupPlayer'
import LineupPlayerNew from '../../LineupPlayerNew/LineupPlayerNew'
import EmptyPlayer from './EmptyPlayer/EmptyPlayer'
import './Lineup.scss'


const Lineup = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog, toggleEditingPos }) => {

  const checkBeingEdited = (pos) => {
    return pos === editingPos
  }

  return (
    <div className="lineup">
        {lineup["qb"] !== null ? 
          <LineupPlayerNew 
            player={lineup.qb} 
            position={'qb'} 
            beingEdited={checkBeingEdited('qb')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'qb'} 
            position={'qb'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('qb')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["rb1"] !== null ? 
          <LineupPlayerNew
            player={lineup.rb1} 
            position={'rb1'} 
            beingEdited={checkBeingEdited('rb1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'rb1'} 
            position={'rb1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["rb2"] !== null ? 
          <LineupPlayerNew
            player={lineup.rb2} 
            position={'rb2'} 
            beingEdited={checkBeingEdited('rb2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'rb2'} 
            position={'rb2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr1"] !== null ? 
          <LineupPlayerNew
            player={lineup.wr1} 
            position={'wr1'} 
            beingEdited={checkBeingEdited('wr1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'wr1'} 
            position={'wr1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr2"] !== null ? 
          <LineupPlayerNew
            player={lineup.wr2} 
            position={'wr2'} 
            beingEdited={checkBeingEdited('wr2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'wr2'} 
            position={'wr2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr3"] !== null ? 
          <LineupPlayerNew
            player={lineup.wr3} 
            position={'wr3'} 
            beingEdited={checkBeingEdited('wr3')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'wr3'} 
            position={'wr3'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr3')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["te"] !== null ? 
          <LineupPlayerNew
            player={lineup.te} 
            position={'te'} 
            beingEdited={checkBeingEdited('te')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'te'} 
            position={'te'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('te')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["flex"] !== null ? 
          <LineupPlayerNew
            player={lineup.flex} 
            position={'flex'} 
            beingEdited={checkBeingEdited('flex')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayer 
            key={'flex'} 
            position={'flex'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('flex')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["dst"] !== null ?
          <LineupPlayerNew
            player={lineup.dst}
            position={'dst'}
            beingEdited={checkBeingEdited('dst')}
            onDelete={onDelete}
            onAdd={onAdd}
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        : <EmptyPlayer
            key={'dst'}
            position={'dst'}
            onAdd={onAdd}
            beingEdited={checkBeingEdited('dst')}
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        }
    </div>
  )
}

export default Lineup