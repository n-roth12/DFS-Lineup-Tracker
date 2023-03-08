import { useState, useEffect } from 'react'
import PastPlayersTable from '../PastPlayersTable/PastPlayersTable'
import UpcomingPlayersTable from '../UpcomingPlayersTable/UpcomingPlayersTable'

const PlayersTableWrapper = ({ state, players, hiddenIds, playerFilter, teamsFilter, posFilter, canAddPos, 
    canQuickAdd, editingPos, playerWrapper, addToLineup, stateFilter, favoritesIds }) => {

  const applyFilters = (playersList) => {
    return playersList.filter((player) => 
      (applyStateFilter(player)) &&
      (playerFilter.length < 1 || player.displayName.toLowerCase().startsWith(playerFilter.toLowerCase())) &&
      (canAddPos(player)) &&
      (posFilter.size < 1 || posFilter.has(player.position.toLowerCase())) &&
      (teamsFilter.length < 1 || teamsFilter.includes(player["team"]))
    )
  }

  const applyStateFilter = (player) => {
    if (!stateFilter) {
      return true
    }
    if (stateFilter === "all") {
      return !hiddenIds.includes(player["playerSiteId"])
    } else if (stateFilter === "favorites") {
      return favoritesIds.includes(player["playerSiteId"])
    } else if (stateFilter === "hidden") {
      return hiddenIds.includes(player["playerSiteId"])
    }
  }

  return (
    <div>
      {state === "past" &&
        <PastPlayersTable 
          players={applyFilters(players)}
          canAddPos={canAddPos}
          editingPos={editingPos}
          playerWrapper={playerWrapper}
          addToLineup={addToLineup}
        />
      }
      {state === "upcoming" &&
        <UpcomingPlayersTable 
          players={applyFilters(players)}
          addToLineup={addToLineup}
          hiddenIds={hiddenIds}
          favoritesIds={favoritesIds} 
          playerWrapper={playerWrapper}
          
        />
      }
    </div>
  )
}

export default PlayersTableWrapper
