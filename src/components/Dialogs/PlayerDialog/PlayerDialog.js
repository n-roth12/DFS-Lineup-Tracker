import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import './PlayerDialog.css'

const PlayerDialog = ({ showPlayerDialog, onClose, dialogPlayer }) => {

  return (
		<Dialog open={showPlayerDialog} className="player-info-dialog">
      {/* {dialogPlayer.stats && 
      <>
      {dialogPlayer.position !== 'DST' ? 
      <>
        <DialogTitle>
          <h3>{dialogPlayer.name}</h3>
          <p>Week {dialogPlayer.stats.week} Rank: {dialogPlayer.position}{dialogPlayer.rank}</p>
          <p>Game: {dialogPlayer.stats.game}</p>
        </DialogTitle>
        <DialogContent className="player-info-content">
          <h4>Passing:</h4>
          <table className="player-info-table">
            <thead>
              <tr>
                <th>CMPs/ATTs</th>
                <th>YRDs</th>
                <th>TDs</th>
                <th>INTs</th>
                <th>2PTs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dialogPlayer.stats.passing_completions}/{dialogPlayer.stats.passing_attempts}</td>
                <td>{dialogPlayer.stats.passing_yards}</td>
                <td>{dialogPlayer.stats.passing_touchdowns}</td>
                <td>{dialogPlayer.stats.passing_interceptions}</td>
                <td>{dialogPlayer.stats.passing_2point_conversions}</td>
              </tr>
            </tbody>
          </table>
          <h4>Rushing:</h4>
          <table className="player-info-table">
            <thead>
              <tr>
                <th>YRDs</th>
                <th>TDs</th>
                <th>INTs</th>
                <th>2PTs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dialogPlayer.stats.rushing_yards}</td>
                <td>{dialogPlayer.stats.rushing_touchdowns}</td>
                <td>{dialogPlayer.stats.fumbles_lost}</td>
                <td>{dialogPlayer.stats.rushing_2point_conversions}</td>
              </tr>
            </tbody>
          </table>
          <h4>Recieving:</h4>
          <table className="player-info-table">
            <thead>
              <tr>
                <th>RECs</th>
                <th>YRDs</th>
                <th>TDs</th>
                <th>2PTs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dialogPlayer.stats.receptions}</td>
                <td>{dialogPlayer.stats.recieving_yards}</td>
                <td>{dialogPlayer.stats.recieving_touchdowns}</td>
                <td>{dialogPlayer.stats.recieving_2point_conversions}</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p><strong>Fanduel Points: {dialogPlayer.stats.fantasy_points.toFixed(2)}</strong></p>
        </DialogContent>
        <DialogActions className="player-info-actions"> 
          <button className="close-btn" onClick={onClose}>Close</button>
        </DialogActions>
      </>
      :
			<>
        <DialogTitle>
          <h3>{dialogPlayer.city} {dialogPlayer.name}</h3>
          <p>Week {dialogPlayer.stats.week} Rank: {dialogPlayer.position}{dialogPlayer.rank}</p>
          <p>Game: {dialogPlayer.stats.game}</p>
        </DialogTitle>
        <DialogContent className="player-info-content">
          <h4>Defense:</h4>
          <table className="player-info-table">
            <thead>
              <tr>
                <th>TDs</th>
                <th>INTs</th>
                <th>Sacks</th>
                <th>SFTs</th>
                <th>FRs</th>
                <th>BLKs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dialogPlayer.stats.touchdowns}</td>
                <td>{dialogPlayer.stats.interceptions}</td>
                <td>{dialogPlayer.stats.sacks}</td>
                <td>{dialogPlayer.stats.safeties}</td>
                <td>{dialogPlayer.stats.fumble_recoveries}</td>
                <td>{dialogPlayer.stats.blocks}</td>
              </tr>
            </tbody>
          </table>
          <h4>Allowed:</h4>
          <table className="player-info-table">
            <thead>
              <tr>
                <th>Rush YRDs</th>
                <th>Pass YRDs</th>
                <th>Tot YRDs</th>
                <th>PTs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dialogPlayer.stats.rushing_yards_against}</td>
                <td>{dialogPlayer.stats.passing_yards_against}</td>
                <td>{dialogPlayer.stats.rushing_yards_against + dialogPlayer.stats.passing_yards_against}</td>
                <td>{dialogPlayer.stats.points_against}</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p><strong>Fanduel Points: {dialogPlayer.stats.fanduel_points.toFixed(2)}</strong></p>
        </DialogContent>
        <DialogActions className="player-info-actions"> 
          <button className="close-btn" onClick={onClose}>Close</button>
        </DialogActions>
      </>
    }
   </>
  } */}
    </Dialog>
  )
}

export default PlayerDialog