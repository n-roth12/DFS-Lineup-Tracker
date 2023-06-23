import './UpcomingPlayersTable.scss'
import { FaPlus, FaSearch, FaTimes, FaArrowUp } from 'react-icons/fa'
import { AiOutlineStar, AiOutlineMinusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { HiOutlineStar, HiStar } from 'react-icons/hi'
import { BiBlock } from 'react-icons/bi'
import { useEffect, useRef } from 'react'
import useResponsiveBreakpoints from '../../../useResponsiveBreakpoints'
import { capitalize } from '@material-ui/core'

const UpcomingPlayersTable = ({ players, canQuickAdd, addPlayerToFavorites, addPlayerToHidden, playerWrapper,
  hiddenIds, removePlayerFromFavorites, removePlayerFromHidden, stateFilter, editingPos, addToLineup, favoritesIds,
  changeStateFilter }) => {

  const targetRef = useRef(null)
  const size = useResponsiveBreakpoints(targetRef, [
    { small: 400 },
    { large: 800 }
  ])

  return (
    <table className={`upcoming-players-table lineups-table ${size}`} ref={targetRef}>
      <thead>
        <th className='icon-col'></th>
        {stateFilter === "all" &&
          <th className='icon-col'></th>
        }
        <th className='icon-col'></th>
        <th className='pos-col'>Pos</th>
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
                  <td className='add-icon-outer icon-col'>
                    <FaPlus onClick={() => addToLineup(editingPos, player)} className='add-icon' />
                  </td>
                  :
                  <td className='no-add-icon-outer icon-col'>
                    <FaPlus className='add-icon inactive' />
                  </td>
                }
                {!favoritesIds.includes(player["playerSiteId"]) ?
                  <td className='favorite-icon-outer icon-col'>
                    <HiOutlineStar onClick={() => addPlayerToFavorites(player)} className='favorite-icon' />
                  </td>
                  :
                  <td className='no-add-icon-outer icon-col'>
                    <HiStar onClick={() => removePlayerFromFavorites(player)} className='favorite-icon inactive' />
                  </td>
                }
                <td className='undraftables-icon-outer icon-col'>
                  <BiBlock onClick={() => addPlayerToHidden(player)} className='undraftables-icon' />
                </td>
              </>
            }
            {stateFilter === "favorites" &&
              <>
                {canQuickAdd(player) || editingPos === player.position ?
                  <td className='add-icon-outer icon-col'>
                    <FaPlus onClick={() => addToLineup(editingPos, player)} className='add-icon' />
                  </td>
                  :
                  <td className='no-add-icon-outer icon-col'>
                    <FaPlus className='add-icon inactive' />
                  </td>
                }
                <td className='no-add-icon-outer icon-col'>
                  <HiStar onClick={() => removePlayerFromFavorites(player)} className='favorite-icon inactive' />
                </td>
              </>
            }
            {stateFilter === "hidden" &&
              <>
                {canQuickAdd(player) || editingPos === player.position ?
                  <td className='add-icon-outer icon-col'>
                    <FaPlus onClick={() => addToLineup(editingPos, player)} className='add-icon' />
                  </td>
                  :
                  <td className='no-add-icon-outer icon-col'>
                    <FaPlus className='add-icon inactive' />
                  </td>
                }
                <td className='undraftables-icon-outer icon-col'>
                  <AiFillMinusCircle onClick={() => removePlayerFromHidden(player)} className='undraftables-icon' />
                </td>
              </>
            }

            <td className='pos-col'>{player.position}</td>
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