import LineupPlayer from './LineupPlayer/LineupPlayer'
import EmptyPlayer from './EmptyPlayer/EmptyPlayer'

const Lineup = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog }) => {

  const checkBeingEdited = (pos) => {
    return pos === editingPos
  }

  return (
    <div className="lineup">
        {lineup.qb ? 
          <LineupPlayer 
            player={lineup.qb} 
            position={'qb'} 
            beingEdited={checkBeingEdited('qb')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'qb'} 
            position={'qb'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('qb')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.rb1 ? 
          <LineupPlayer 
            player={lineup.rb1} 
            position={'rb1'} 
            beingEdited={checkBeingEdited('rb1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'rb1'} 
            position={'rb1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb1')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.rb2 ? 
          <LineupPlayer 
          player={lineup.rb2} 
          position={'rb2'} 
          beingEdited={checkBeingEdited('rb2')} 
          onDelete={onDelete} 
          onAdd={onAdd} 
          onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'rb2'} 
            position={'rb2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb2')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.wr1 ? 
          <LineupPlayer 
            player={lineup.wr1} 
            position={'wr1'} 
            beingEdited={checkBeingEdited('wr1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'wr1'} 
            position={'wr1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr1')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.wr2 ? 
          <LineupPlayer 
            player={lineup.wr2} 
            position={'wr2'} 
            beingEdited={checkBeingEdited('wr2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'wr2'} 
            position={'wr2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr2')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.wr3 ? 
          <LineupPlayer 
            player={lineup.wr3} 
            position={'wr3'} 
            beingEdited={checkBeingEdited('wr3')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'wr3'} 
            position={'wr3'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr3')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.te ? 
          <LineupPlayer 
            player={lineup.te} 
            position={'te'} 
            beingEdited={checkBeingEdited('te')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'te'} 
            position={'te'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('te')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.flex ? 
          <LineupPlayer 
            player={lineup.flex} 
            position={'flex'} 
            beingEdited={checkBeingEdited('flex')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog} /> 
        : <EmptyPlayer 
            key={'flex'} 
            position={'flex'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('flex')} 
            cancelEdit={cancelEdit} />
        }
        {lineup.dst ?
          <LineupPlayer
            player={lineup.dst}
            position={'dst'}
            beingEdited={checkBeingEdited('dst')}
            onDelete={onDelete}
            onAdd={onAdd}
            onOpenDialog={onOpenDialog} />
        : <EmptyPlayer
            key={'dst'}
            position={'dst'}
            onAdd={onAdd}
            beingEdited={checkBeingEdited('dst')}
            cancelEdit={cancelEdit} /> 
        }
    </div>
  )
}

export default Lineup