import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'
import LineupMini from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'
import './GenerateLineupDialog.scss'
import GeneratedLineup from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'

const GenerateLineupDialog = ({ showGenerateLineupDialog, onClose, draftGroupId, games }) => {

  const [generatedLineup, setGeneratedLineup] = useState()
  const [eligibleFlexPositions, setEligibleFlexPositions] = useState(new Set(["RB", "WR", "TE"]))
  const [gameToStack, setGameToStack] = useState()
  const [teamToStack, setTeamToStack] = useState()

  const generateLineup = async () => {
    const res = await fetch(`/lineups/generate`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroupId,
        "eligibleFlexPositions": Array.from(eligibleFlexPositions)
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

  const deletePlayerFromLineup = (index) => {
    var generatedLineupCopy = [...generatedLineup]
    generatedLineupCopy[index]["player"] = {}
    setGeneratedLineup(generatedLineupCopy)
  }

  return (
    <Dialog open={showGenerateLineupDialog} className="generate-lineup-dialog" fullWidth maxWidth="sm" >
      <DialogTitle className="title">
          <div className='title-inner'>
            <p>Optimize Lineup</p> <FaTimes className='close-btn' onClick={onClose}/>
          </div>
      </DialogTitle>
      <DialogContent className='content'>
        <div className='content-inner'>
          <div className='generated-lineup-wrapper'>
            <GeneratedLineup lineup={generatedLineup} onDelete={deletePlayerFromLineup} />
          </div>
          <div className='options-wrapper'>
            <div className='flex-position-buttons-wrapper'>
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
            <div className='radios'>
              <p>Replace:</p>
              <input type="radio" defaultChecked="true" value="full" name="generate-option" /> Entire Lineup
              <input type="radio" value="empty" name="generate-option" /> Empty Positions
            </div>
            <div className='game-stacks'>
              <p>Stack Game:</p>
              <select name="cars" id="cars">
                <option value="" defaultValue={true}>None</option>
                {games && games.length > 0 && games.map((game) => 
                  <option value={game["gameId"]}>{game["awayTeam"]} @ {game["homeTeam"]}</option>
                )}
              </select>
              <select name="players-to-stack">
                {generatedLineup && generatedLineup.length > 0 && generatedLineup.map((player, index) =>
                  <option value={index}>{index + 1}</option>
                )}
              </select>
            </div>
            <div className='punt-players'>
              <p>Punt Positions:</p>
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
        </div>
        <button className='generate-btn' onClick={generateLineup}>Optimize</button>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <button className='save-btn'>Apply</button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateLineupDialog