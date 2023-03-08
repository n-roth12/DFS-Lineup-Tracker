import './PastPlayersTable.scss'
import { FaPlus } from 'react-icons/fa'

const PastPlayersTable = ({ players, editingPos, playerFilter, stateFilter, posFilter, teamsFilter, pastDraftablesData, showEditLineup, playerWrapper, addToLineup, canAddPos }) => {
  return (
    <table className='lineups-table past-players-table'>
      <thead>
        <tr>
          {editingPos &&
            <th className='add-icon-header'></th>
          }
          <th>Pos</th>
          <th>Name</th>
          <th>Points</th>
          <th>Salary</th>
          <th>Game</th>
          <th>Stats</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) =>
          <tr>
            {editingPos &&
            <>
              {canAddPos(player) ?
                <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon' /></td>
                :
                <td className='no-add-icon-outer'><FaPlus className='no-add-icon' /></td>
              }
            </>
            }
            <td>{player.position}</td>
            <td className='name-col player-name' onClick={() => playerWrapper(player)}>{player.displayName} {player.status !== "" && `(${player.status})`}</td>
            <td>{player["stats"]["stats"] ? parseFloat(player["stats"]["stats"]["fantasy_points"]).toFixed(2) : ""} PTS</td>
            <td>${player.salary}</td>
            <td>{player["game"] ? `${player["game"]["awayTeam"]} 17 @ ${player["game"]["homeTeam"]} 24` : ''}</td>
            <td className='statsDisplay-wrapper'>{player["statsDisplay"] && player["statsDisplay"].map((stat) =>
              stat["key"] !== "PTS" &&
              <span className='statsDisplay'>
                <span className='value'>{stat["value"]}</span>
                <span className='key'>{stat["key"]}</span>
              </span>
            )}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default PastPlayersTable
