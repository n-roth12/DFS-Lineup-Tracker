import { useState, useEffect } from 'react'
import './ImportLineupsDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { FaTimes } from 'react-icons/fa';

const ImportLineupsDialog = ({ showImportDialog, onClose, onFileChange, onFileUpload }) => {

  const [selectedSite, setSelectedSite] = useState("draftkings")

  return (
    <Dialog open={showImportDialog} className="importLineupsDialog">
      <DialogTitle className="title">
        <div className='title-inner'>
          <p>Import Lineups</p> <FaTimes className='close-btn' onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent className='content'>
        <div>
          <p>Select site of lineups being imported:</p>
        </div>
        <div>
          <button className={selectedSite === "draftkings" && "selected"}
            onClick={() => setSelectedSite("draftkings")}>DraftKings</button>
          <button className={selectedSite === "yahoo" && "selected"}
            onClick={() => setSelectedSite("yahoo")}>Yahoo</button>
          <button className={selectedSite === "fanduel" && "selected"}
            onClick={() => setSelectedSite("fanduel")}>Fanduel</button>
        </div>
        <div>
          <input
            type="file"
            onChange={onFileChange}
            accept=".csv"
          />
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <button className="submit-btn btn" onClick={onFileUpload}>Upload</button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportLineupsDialog