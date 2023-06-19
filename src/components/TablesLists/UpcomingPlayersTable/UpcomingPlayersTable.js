import './UpcomingPlayersTable.scss'
import { FaPlus, FaSearch, FaTimes, FaArrowUp } from 'react-icons/fa'
import { AiOutlineStar, AiOutlineMinusCircle } from 'react-icons/ai'
import { BiBlock } from 'react-icons/bi'
import { useEffect, useRef } from 'react'
import useResponsiveBreakpoints from '../../../useResponsiveBreakpoints'
import { capitalize } from '@material-ui/core'

const UpcomingPlayersTable = ({ players, canQuickAdd, addPlayerToFavorites, addPlayerToHidden, playerWrapper, 
    hiddenIds, removePlayerFromFavorites, removePlayerFromHidden, stateFilter, editingPos, addToLineup, favoritesIds,
    changeStateFilter}) => {

  const targetRef = useRef(null)
  const size = useResponsiveBreakpoints(targetRef, [
    { small: 600 },
    { large: 800 }
  ])
  console.log(size)

  return (
    <table className={`upcoming-players-table lineups-table ${size}`} ref={targetRef}>
      <thead>
        <th></th>
        <th></th>
        <th></th>
        <th>Pos</th>
        <th className='name-col'>Name</th>
        <th>Salary <FaArrowUp /></th>
        <th>Game</th>
        <th className='hide-small'>OPRK</th>
        <th className='hide-small'>FPPG</th>
      </thead>
      <tbody>
        {players.length > 0 ? players.map((player, index) =>
          <tr>
            {stateFilter === "all" &&
              <>
                {canQuickAdd(player) || editingPos === player.position ?
                  <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon' /></td>
                  :
                  <td className='no-add-icon-outer'><FaPlus className='no-add-icon' /></td>
                }
                {!favoritesIds.includes(player["playerSiteId"]) ?
                  <td className='favorite-icon-outer' onClick={() => addPlayerToFavorites(player)}><AiOutlineStar className='favorite-icon' /></td>
                  :
                  <td className='no-add-icon-outer'><AiOutlineStar className='no-favorite-icon' /></td>
                }
                {!hiddenIds.includes(player["playerSiteId"]) ?
                  <td className='undraftables-icon-outer' onClick={() => addPlayerToHidden(player)}><BiBlock className='undraftables-icon' /></td>
                  :
                  <td className='no-undraftables-icon-outer'><AiOutlineMinusCircle className='no-undraftables-icon' /></td>
                }
              </>
            }
            {stateFilter === "favorites" &&
              <>
                {canQuickAdd(player) || editingPos === player.position ?
                  <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon' /></td>
                  :
                  <td className='no-add-icon-outer'><FaPlus className='no-add-icon' /></td>
                }
                <td className='no-add-icon-outer'><AiOutlineStar className='no-favorite-icon' /></td>
                <td className='undraftables-icon-outer' onClick={() => removePlayerFromFavorites(player)}><AiOutlineMinusCircle className='undraftables-icon' /></td>
              </>
            }
            {stateFilter === "hidden" &&
              <>
                {canQuickAdd(player) || editingPos === player.position ?
                  <td className='add-icon-outer' onClick={() => addToLineup(editingPos, player)}><FaPlus className='add-icon' /></td>
                  :
                  <td className='no-add-icon-outer'><FaPlus className='no-add-icon' /></td>
                }
                <td className='no-add-icon-outer'><AiOutlineStar className='no-favorite-icon' /></td>
                <td className='undraftables-icon-outer' onClick={() => removePlayerFromHidden(player)}><AiOutlineMinusCircle className='undraftables-icon' /></td>
              </>
            }

            <td>{player.position}</td>
            <td className='name-col player-name' onClick={() => playerWrapper(player)}>{player.displayName} {player.status !== "" && `(${player.status})`}</td>
            <td>${player.salary}</td>
            <td><span className={player["team"] === player["game"]["homeTeam"] ? "bold" : ""}>
              {player["game"]["homeTeam"]}</span> @ <span className={player["team"] === player["game"]["awayTeam"] ? "bold" : ""}>
              {player["game"]["awayTeam"]}</span>
            </td>
            <td className='hide-small'>{player["oprk"]}</td>
            <td className='hide-small'>{parseFloat(player["fppg"]).toFixed(2)}</td>
          </tr>
        )
      :
        <tr className='empty-players-row'>
          <td>
            <button className='add-players-btn' 
              onClick={() => changeStateFilter("all")}>Add Players to {capitalize(stateFilter)}
            </button>
          </td>
        </tr>
      }
      </tbody>
    </table >
  )
}

export default UpcomingPlayersTable