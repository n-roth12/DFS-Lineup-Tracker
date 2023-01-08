import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'
import './GenerateLineupDialog.scss'
import GeneratedLineup from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'

const GenerateLineupDialog = ({ showGenerateLineupDialog, onClose, draftGroupId, games }) => {

  const [generatedLineup, setGeneratedLineup] = useState()
  const [eligibleFlexPositions, setEligibleFlexPositions] = useState(new Set(["RB", "WR", "TE"]))
  const [gameToStack, setGameToStack] = useState([])
  const [numberToStack, setNumberToStack] = useState()
  const [teamToStack, setTeamToStack] = useState()
  const [activeStackOption, setActiveStackOption] = useState("team")
  const [teams, setTeams] = useState([])

  useEffect(() => {
    getTeams()
  }, [])

  const generateLineup = async () => {
    console.log(gameToStack["awayTeam"])
    const res = await fetch(`/lineups/generate`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroupId,
        "eligibleFlexPositions": Array.from(eligibleFlexPositions),
        "gameStack": Array.from(gameToStack),
        "teamStack": teamToStack,
        "numberToStack": numberToStack
      })
    })
    const data = await res.json()
    setGeneratedLineup(data["lineup"])
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

  return (
    <Dialog open={showGenerateLineupDialog} className="generate-lineup-dialog" maxWidth="md" >
      <DialogTitle className="title">
          <div className='title-inner'>
            <h2>Optimize Lineup</h2> <FaTimes className='close-btn' onClick={onClose}/>
          </div>
      </DialogTitle>
      <DialogContent className='content'>
        <div className='content-inner'>
          <div className='generated-lineup-wrapper'>
            <h3>Lineup</h3>
            <div className='generated-lineup-details'>
              <p>Salary: </p>
              <p>Proj PTS</p>
            </div>
            <GeneratedLineup lineup={generatedLineup} onDelete={deletePlayerFromLineup} />
          </div>
          <div className='options-wrapper'>
            <h3>Options</h3>
            <div className='flex-position-buttons-wrapper section'>
              <p>Eligible positions for flex:</p>
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
            <div className='radios section'>
              <p>Replace:</p>
              <input type="radio" defaultChecked="true" value="full" name="generate-option" /> Entire Lineup
              <input type="radio" value="empty" name="generate-option" /> Empty Positions
            </div>
            <div className='game-stacks section'>
              <p>Stack:</p>
              <div>
                <input type="radio" value="team" checked={activeStackOption === "team"} 
                  onChange={stackOptionChange} name="stack-option" /> Team
                <input type="radio" value="game" checked={activeStackOption === "game"} 
                  onChange={stackOptionChange} name="stack-option" /> Game
              </div>
              {activeStackOption === "game" &&
                <>
                  <label for="game">Game: </label>
                  <select name="game" id="game" value={gameToStack} onChange={handleGameStack}>
                    <option default="true" value="">None</option>
                    {games && games.length > 0 && games.map((game) => 
                      <option value={[game["homeTeam"], game["awayTeam"]]}
                        onClick={() => setGameToStack(game)}>{game["awayTeam"]} @ {game["homeTeam"]}</option>
                    )}
                  </select>
                  <label for="players-to-stack">Players: </label>
                  <select name="players-to-stack" value={numberToStack} onChange={handleStackCountChange}>
                    {generatedLineup && generatedLineup.length > 0 && generatedLineup.map((player, index) =>
                      <option value={index + 1}>{index + 1}</option>
                    )}
                  </select>
                </>
              }
              {activeStackOption === "team" &&
                <>
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
                </>
              }
            </div>
            <div className='punt-players section'>
              <p>Punt:</p>
              <label for="punt-players">Punt Position:</label>
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
            <button className='generate-btn' onClick={generateLineup}>Generate Lineup</button>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <button className='apply-btn'>Apply</button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateLineupDialog