import './DeleteLineupsDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { FaTimes } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';

const DeleteLineupsDialog = ({ lineupsToDelete, deleteLineups, onClose, showDeleteLineupsDialog }) => {

  return (
    <Dialog open={showDeleteLineupsDialog} className="delete-lineups-dialog">
        <DialogTitle className='title'>
            <FaTimes className="close-btn" onClick={onClose} />
        </DialogTitle>
        <DialogContent className='content'>
          {lineupsToDelete.length > 2 ?
            <h2>Are you sure you would like to delete {lineupsToDelete.length} lineups?</h2>
          :
            <h2>Are you sure you would like to delete this lineup?</h2>
          }
        </DialogContent>
        <DialogActions className='actions'>
            <button className='cancel-btn' onClick={onClose}>Cancel</button>
            <button className='delete-btn' onClick={deleteLineups}>Delete <BiTrash className='trash-icon'/></button>
        </DialogActions>
    </Dialog>
  )
}

export default DeleteLineupsDialog