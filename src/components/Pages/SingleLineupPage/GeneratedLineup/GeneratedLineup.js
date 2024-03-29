import './GeneratedLineup.scss'
import { FaTimes } from 'react-icons/fa'

const GeneratedLineup = ({ lineup, onDelete }) => {
  return (
    <div className="generated-lineup">
      {lineup && lineup.map((player, index) =>
        player["player"] ?
          <div className="player">
            <p className='position'>{player["pos"].toUpperCase()}</p>
            <p className='name'>{player["player"]["firstName"]} {player["player"]["lastName"]}</p>
            <p className='salary'>${player["player"]["salary"]}</p>
            <FaTimes className='delete-btn' onClick={() => onDelete(index)} />
          </div>
          :
          <div className="player">
            <p className='position'>{player["pos"].toUpperCase()}</p>
            <p className='salary'>Empty</p>
          </div>
      )}
    </div>
  )
}

export default GeneratedLineup