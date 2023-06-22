import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'
import { Roller } from 'react-awesome-spinners'
import './GenerateLineupDialog.scss'
import GeneratedLineup from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'
import { api_url } from '../../../Constants'

const GenerateLineupDialog = ({ showGenerateLineupDialog, onClose, draftGroupId, games, onApply, currentLineup }) => {

  const [generatedLineup, setGeneratedLineup] = useState([])
  const [eligibleFlexPositions, setEligibleFlexPositions] = useState(new Set(["RB", "WR", "TE"]))
  const [gameToStack, setGameToStack] = useState([])
  const [numberToStack, setNumberToStack] = useState()
  const [teamToStack, setTeamToStack] = useState()
  const [activeStackOption, setActiveStackOption] = useState("team")
  const [replaceEntireLineup, setReplaceEntireLineup] = useState("true")
  const [includeHiddenPlayers, setIncludeHiddenPlayers] = useState(false)
  const [loadingLineup, setLoadingLineup] = useState(false)
  const [lineupSalary, setLineupSalary] = useState()
  const [lineupOrder, setLineupOrder] = useState(["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    getTeams()
    getOrderedPositions()
  }, [])

  useEffect(() => {
    var salary = 0
    if (generatedLineup?.length > 0) {
      generatedLineup.map(player => {
        salary += player?.player?.salary || 0
      })
    }
    setLineupSalary(salary)
  }, [generatedLineup])

  const getOrderedPositions = () => {
    var result = []
    currentLineup && Object.keys(currentLineup).length > 0 && lineupOrder.length > 0 &&
      lineupOrder.map(position => {
        result.push({ "pos": position, "player": currentLineup[position.toLowerCase()] })
      })
    setGeneratedLineup(result)
  }

  const generateLineup = async () => {
    setLoadingLineup(true)
    var existingLineupDict = {}
    generatedLineup.map(player => {
      existingLineupDict[player["pos"]] = player["player"]
    })
    const res = await fetch(`${api_url}/lineups/generate`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroupId,
        "existingLineup": existingLineupDict,
        "eligibleFlexPositions": Array.from(eligibleFlexPositions),
        "replaceEntireLineup": replaceEntireLineup,
        "gameStack": Array.from(gameToStack),
        "teamStack": teamToStack,
        "numberToStack": numberToStack
      })
    })
    const data = await res.json()
    setGeneratedLineup(data["lineup"])
    setLoadingLineup(false)
  }

  const toggleCheck = (position) => {
    if (eligibleFlexPositions.has(position)) {
      eligibleFlexPositions.delete(position)
    } else {
      eligibleFlexPositions.add(position)
    }
    setEligibleFlexPositions(new Set(eligibleFlexPositions))
  }

  const getTeams = () => {
    var temp = []
    games.map((game) => {
      temp.push(game["awayTeam"])
      temp.push(game["homeTeam"])
    })
    setTeams(temp)
  }

  const deletePlayerFromLineup = (index) => {
    var generatedLineupCopy = [...generatedLineup]
    generatedLineupCopy[index]["player"] = {}
    setGeneratedLineup(generatedLineupCopy)
  }

  const handleGameStack = (e) => {
    if (e.target.value === "") {
      setGameToStack([])
    } else {
      setGameToStack(e.target.value.split(","))
    }
  }

  const handleTeamStack = (e) => {
    setTeamToStack(e.target.value)
  }

  const handleStackCountChange = (e) => {
    setNumberToStack(e.target.value)
  }

  const stackOptionChange = (e) => {
    setGameToStack([])
    setTeamToStack()
    setActiveStackOption(e.target.value)
  }

  const handleReplaceOptionChange = (e) => {
    setReplaceEntireLineup(e.target.value)
  }

  const onCloseWrapper = () => {
    onClose()
    getOrderedPositions()
  }

  return (
    <Dialog open={showGenerateLineupDialog} className="generate-lineup-dialog" fullWidth maxWidth="md" >
      <DialogTitle className="title">
        <div className='title-inner'>
          <h2>Optimize Lineup</h2> <FaTimes className='close-btn' onClick={onCloseWrapper} />
        </div>
      </DialogTitle>
      <DialogContent className='content'>
        <div className='content-inner'>
          <div className='options-wrapper'>
            <h3>Options</h3>
            <div className='options-wrapper-inner'>
              <div className='flex-position-buttons-wrapper section'>
                <h4>Eligible positions for flex:</h4>
                <div>
                  <input type="checkbox" id="RB" name="RB" value="RB"
                    checked={eligibleFlexPositions.has("RB")} onChange={() => toggleCheck("RB")} />
                  <label for="RB">RB</label>
                  <input type="checkbox" id="WR" name="WR" value="WR"
                    checked={eligibleFlexPositions.has("WR")} onChange={() => toggleCheck("WR")} />
                  <label for="WR">WR</label>
                  <input type="checkbox" id="TE" name="TE" value="TE"
                    checked={eligibleFlexPositions.has("TE")} onChange={() => toggleCheck("TE")} />
                  <label for="TE">TE</label>
                </div>
              </div>
              <hr />
              <div className='section'>
                <input type="checkbox" checked={includeHiddenPlayers} id="hidden-option" onChange={() => setIncludeHiddenPlayers(!includeHiddenPlayers)}
                  value="full" name="hidden-option" />
                <label for="hidden-option">Include hidden players: </label>
              </div>
              <hr />
              <div className='radios section'>
                <h4>Replace:</h4>
                <div>
                  <input type="radio" checked={replaceEntireLineup === "true"} onChange={handleReplaceOptionChange}
                    value="true" name="generate-option" />
                  <label>Entire Lineup</label>
                  <input type="radio" checked={replaceEntireLineup === "false"} onChange={handleReplaceOptionChange}
                    value="false" name="generate-option" />
                  <label>Empty Positions</label>
                </div>
              </div>
              <hr />
              <div className='game-stacks section'>
                <h4>Stack:</h4>
                <div>
                  <input type="radio" value="team" id="team" checked={activeStackOption === "team"}
                    onChange={stackOptionChange} name="stack-option" />
                  <label for="team">Team</label>
                  <input type="radio" value="game" id="game" checked={activeStackOption === "game"}
                    onChange={stackOptionChange} name="stack-option" />
                  <label for="game">Game</label>
                </div>
                {activeStackOption === "game" &&
                  <>
                    <label for="game-stack">Game: </label>
                    <select name="game-stack" id="game-stack" value={gameToStack} onChange={handleGameStack}>
                      <option default="true" value="">None</option>
                      {games && games.length > 0 && games.map((game) =>
                        <option value={[game["homeTeam"], game["awayTeam"]]}
                          onClick={() => setGameToStack(game)}>{game["awayTeam"]} @ {game["homeTeam"]}</option>
                      )}
                    </select>
                    <label for="players-stack">Players: </label>
                    <select name="players-stack" id="players-stack" value={numberToStack} onChange={handleStackCountChange}>
                      {generatedLineup && generatedLineup.length > 0 && generatedLineup.map((player, index) =>
                        <option value={index + 1}>{index + 1}</option>
                      )}
                    </select>
                  </>
                }
                {activeStackOption === "team" &&
                  <div>
                    <label for="team">Team: </label>
                    <select name="team" id="team" onChange={handleTeamStack} value={teamToStack}>
                      <option value="" defaultValue="true" onChange={handleTeamStack}>None</option>
                      {teams && teams.length > 0 && teams.map((team) =>
                        <option value={team}>{team}</option>
                      )}
                    </select>
                    <label for="players-to-stack">Players: </label>
                    <select name="players-to-stack" value={numberToStack} onChange={handleStackCountChange}>
                      {generatedLineup && generatedLineup.length > 0 && generatedLineup.map((player, index) =>
                        <option value={index + 1}>{index + 1}</option>
                      )}
                    </select>
                  </div>
                }
              </div>
              <hr />
              <div className='punt-players section'>
                <h4>Punt Position:</h4>
                <select name="punt-players">
                  <option value="">None</option>
                  <option value="QB">QB</option>
                  <option value="RB">1 RB</option>
                  <option value="WR">1 WR</option>
                  <option value="TE">TE</option>
                  <option value="FLEX">FLEX</option>
                  <option value="DST">DST</option>
                </select>
              </div>
            </div>
            <button className='generate-btn' onClick={generateLineup}>Generate Lineup</button>
          </div>
          <div className='generated-lineup-wrapper'>
            <h3>Lineup</h3>
            <div className='generated-lineup-wrapper-inner'>
              <div className='generated-lineup-details'>
                <p>Salary: ${lineupSalary}</p>
              </div>
              {!loadingLineup ?
                <GeneratedLineup lineup={generatedLineup} onDelete={deletePlayerFromLineup} />
                :
                <div className='roller-wrapper'>
                  <Roller className="roller" />
                </div>
              }
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <button className='apply-btn' onClick={() => onApply(generatedLineup)}>Apply</button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateLineupDialog