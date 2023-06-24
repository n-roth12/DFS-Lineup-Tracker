import './HistoryPage.scss'
import { useState, useEffect, useRef } from 'react'
import PlayersTable from '../../TablesLists/PlayersTable/PlayersTable'
import { Roller } from 'react-awesome-spinners'
import { api_url } from '../../../Constants'
import Helmet from 'react-helmet'
const ResearchPage = () => {

  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  const [playerData, setPlayerData] = useState([])
  const [gamesData, setGamesData] = useState([])
  const [selectedYear, setSelectedYear] = useState("2021")
  const [selectedWeek, setSelectedWeek] = useState("All")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    weekSearch(selectedWeek, selectedYear)
  }, [])

  useEffect(() => {
    weekSearch(selectedWeek, selectedYear)
  }, [selectedWeek, selectedYear])

  // const getTopSearches = async () => {
  //   const res = await fetch(`${api_url}/history/search/top_searches`, {
  //     method: "GET",
  //     headers: {
  //       "x-access-token": sessionStorage.dfsTrackerToken
  //     },
  //   })
  //   const result = await res.json()
  //   setTopSearches(result["names"])
  // }

  const weekSearch = async (week, year) => {
    setLoading(true)
    if (week === "All") {
      const res = await fetch(`${api_url}/history/search/year?week=${week}&year=${year}`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        },
      })
      const result = await res.json()
      setPlayerData(result["players"])
    } else {
      const res = await fetch(`${api_url}/history/search/week?week=${week}&year=${year}`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        },
      })
      const result = await res.json()
      setPlayerData(result["players"])
      // var games_data = []
      // result["games"].map((game) => {
      //   const games_split = game.split("@")
      //   games_data.push(
      //     {
      //       "game": game,
      //       "away": games_split[0],
      //       "home": games_split[1]
      //     })
      // })
      // setGamesData(games_data)
    }
    setLoading(false)
  }

  // const playerSearch = async (name) => {
  //   setLoading(true)
  //   const res = await fetch(`${api_url}/history/player?name=${name}`, {
  //     method: "GET",
  //     headers: {
  //       "x-access-token": sessionStorage.dfsTrackerToken
  //     }
  //   })
  //   if (res.status === 200) {
  //     setPlayerSearchData(await res.json())
  //   } else {
  //     setPlayerSearchData({"error": "No Player Found"})
  //   }
  //   setLoading(false)
  // }

  // const getTeams = async () => {
  //   const res = await fetch(`${api_url}/nfl/teams`, {
  //     method: "GET",
  //     headers: {
  //       "x-access-token": sessionStorage.dfsTrackerToken
  //     }
  //   })
  //   setTeams(await res.json())
  // }

  const changeYear = (year) => {
    setSelectedWeek("All")
    setSelectedYear(year)
  }

  return (
    <div className="history-page page">
      <Helmet>
        <meta charSet="utf-8" />
        <title>NFL Fantasy Stats | Mainslater</title>
        <meta name='description' content="Past NFL Fantasy Football player stats." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </Helmet>
      <div className="header">
        <h1>Past Fantasy Football Stats</h1>
        <div className="header-inner">
          <div className="selectors">
            <select
              className="year-select"
              value={selectedYear}
              onChange={(e) => changeYear(e.target.value)}>
              {years.map((year) =>
                <option value={year} key={year}>{year}</option>
              )}
            </select>
            <select
              className="week-select"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}>
              {weeks.map((week) =>
                !(week > 17 && selectedYear < 2021) &&
                <option value={week} key={week}>Week {week}</option>
              )}
              <option value={"All"} key={"All"}>Season</option>
            </select>
          </div>
        </div>
      </div>

      {loading ?
        <div className='loading-screen'>
          <h3><Roller /></h3>
        </div>
        :
        <>
          {playerData["All"] &&
            <PlayersTable players={playerData} />
          }
        </>
      }

    </div>
  )
}

export default ResearchPage