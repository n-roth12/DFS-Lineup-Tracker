import { useEffect, useState } from 'react'
import './RecommendedTagsDialog.scss'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { FaTimes, FaPlus } from 'react-icons/fa';

const RecommendedTagsDialog = ({ tags, showRecommendedTagsDialog, onClose, lineupTags, onSave }) => {

  const [activeTags, setActiveTags] = useState([{"category": "Punt", "value": "TE"}])
  const [recommendedTags, setRecommendedTags] = useState([])

  useEffect(() => {
    setActiveTags(lineupTags)
    setRecommendedTags(tags)
  }, [])

  const addTag = (tag) => {
    setActiveTags([...activeTags, tag])
    setRecommendedTags([...recommendedTags.filter((t) => t["category"] !== tag["category"] || t["value"] !== tag["value"] )])
  }

  const removeTag = (tag) => {
    setActiveTags([...activeTags.filter((t) => t["category"] !== tag["category"] || t["value"] !== tag["value"] )])
    setRecommendedTags([...recommendedTags, tag])
  }

  return (
    <Dialog open={showRecommendedTagsDialog} className="recommended-tags-dialog">
      <DialogTitle className='title'>
        <div className='title-inner'>
          <h1>Tags</h1>
          <FaTimes className="close-btn" onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent className='content'>
        <h2>Active Tags:</h2>
        {activeTags && activeTags.length > 0 &&
          <div className='active-tags-wrapper'>
            {activeTags.map((tag) => 
            <div className='tag active-tag' onClick={() => removeTag(tag)}>
              <FaTimes className='icon delete-icon' /><p className='tag-value'>{`${tag["category"]} ${tag["value"] ? `: ${tag["value"]}` : "" }`}</p>
            </div>
            )}
          </div>
        }
        <h2>Recommended Tags:</h2>
        {tags && tags.length > 0 &&
          <div className='recommended-tags-wrapper'>
            {recommendedTags.map((tag) => 
            <div className='tag recommended-tag' onClick={() => addTag(tag)}>
              <FaPlus className='icon add-icon' /><p className='tag-value'>{`${tag["category"]} ${tag["value"] ? `: ${tag["value"]}` : "" }`}</p>
            </div>
            )}
          </div>
        }
        </DialogContent>
      <DialogActions className='actions'>
        <button className='cancel-btn' onClick={onClose}>Cancel</button>
        <button className='save-btn' onClick={() => onSave(activeTags)}>Save</button>
      </DialogActions>
    </Dialog>
  )
}

export default RecommendedTagsDialog