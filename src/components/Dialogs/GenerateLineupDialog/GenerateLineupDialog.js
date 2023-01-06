import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'
import LineupMini from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'
import './GenerateLineupDialog.scss'
import GeneratedLineup from '../../Pages/SingleLineupPage/GeneratedLineup/GeneratedLineup'

const GenerateLineupDialog = ({ showGenerateLineupDialog, onClose, draftGroupId }) => {

  const [generatedLineup, setGeneratedLineup] = useState()

  const generateLineup = async () => {
    const res = await fetch(`/lineups/generate?draftGroupId=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
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