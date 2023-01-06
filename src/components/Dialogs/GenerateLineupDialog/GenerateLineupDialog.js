import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'
import LineupMini from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'
import './GenerateLineupDialog.scss'
import GeneratedLineup from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'

const GenerateLineupDialog = ({ showGenerateLineupDialog, onClose, draftGroupId }) => {

  const [generatedLineup, setGeneratedLineup] = useState()
  const [eligibleFlexPositions, setEligibleFlexPositions] = useState(new Set("RB", "WR", "TE"))

  const generateLineup = async () => {
    const res = await fetch(`/lineups/generate`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draftGroupId": draftGroupId,
        "eligibleFlexPositions": eligibleFlexPositions
      })
    })
    const data = await res.json()
    setGeneratedLineup(data["lineup"])
  }

  return (
    <Dialog open={showGenerateLineupDialog} className="generate-lineup-dialog">
      <DialogTitle className="title">
          <div className='title-inner'>
            <p>Generate a Lineup</p> <FaTimes className='close-btn' onClick={onClose}/>
          </div>
      </DialogTitle>
      <DialogContent className='content'>
        <div className='flex-position-buttons-wrapper'>
          <p>Eligible positions for flex:</p>
          <input type="checkbox" id="RB" name="RB" value="RB" checked={() => eligibleFlexPositions.has("RB")}/>
          <label for="RB">RB</label>
          <input type="checkbox" id="WR" name="WR" value="WR" checked={() => eligibleFlexPositions.has("WR")}/>
          <label for="WR">WR</label>
          <input type="checkbox" id="TE" name="TE" value="TE" checked={() => eligibleFlexPositions.has("TE")}/>
          <label for="TE">TE</label>
        </div>
        <button className='generate-btn' onClick={generateLineup}>Generate</button>
        <GeneratedLineup lineup={generatedLineup} />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <button className='save-btn'>Apply</button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateLineupDialog