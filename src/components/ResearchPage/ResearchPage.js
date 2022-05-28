import './ResearchPage.scss'
import { useState, useEffect, useRef } from 'react'
import PlayerDialog from '../SingleLineupPage/PlayerDialog/PlayerDialog'
import PlayersTable from './PlayersTable/PlayersTable'
import GamesSlider from './GamesSlider/GamesSlider'
import PlayerSearch from './PlayerSearch/PlayerSearch'
import ResearchHeader from './ResearchHeader/ResearchHeader'

const ResearchPage = () => {

  const [playerData, setPlayerData] = useState([])
  const [gamesData, setGamesData] = useState([])
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [playerSearchData, setPlayerSearchData] = useState({})
  const [activeTab, setActiveTab] = useState("week")
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("18")
  const [selectedTeam, setSelectedTeam] = useState({})

  return (
    <div className="research-page">
      <ResearchHeader 
        setSelectedWeek={setSelectedWeek}
        selectedWeek={selectedWeek}
        setSelectedYear={setSelectedYear}
        selectedYear={selectedYear}
        changeTab={setActiveTab} 
        activeTab={activeTab}
        setPlayers={setPlayerData}
        setGames={setGamesData}
        setPlayerSearchData={setPlayerSearchData}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        />

      {activeTab === "week" && playerData["All"] &&
        <div className="search-results">
          <GamesSlider 
            games={gamesData} 
            selectedWeek={selectedWeek} 
            selectedYear={selectedYear} />
          <PlayersTable players={playerData} />
        </div>
      }

      { activeTab === "player" && playerSearchData &&
        <PlayerSearch playerSearchData={playerSearchData} />
      }

    </div>
  )
}

export default ResearchPage