import './RecommendedTagsDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { FaTimes } from 'react-icons/fa';

const RecommendedTagsDialog = ({ tags, showRecommendedTagsDialog, onClose }) => {

  return (
    <Dialog open={showRecommendedTagsDialog} className="recommended-tags-dialog">
      <DialogTitle className='title'>
        <FaTimes className="close-btn" onClick={onClose} />
      </DialogTitle>
      <DialogContent className='content'>
        <h2>Recommended Tags:</h2>
        {tags && tags.length > 0 &&
          <div>
            {tags.map((tag) => 
            <div>
              <p>{`${tag["category"]} ${tag["value"] ? `: ${tag["value"]}` : "" }`}</p>
            </div>
            )}
          </div>
        }
        </DialogContent>
      <DialogActions className='actions'>
        <button className='cancel-btn' onClick={onClose}>Cancel</button>
        <button className='save-btn'>Save</button>
      </DialogActions>
    </Dialog>
  )
}

export default RecommendedTagsDialog