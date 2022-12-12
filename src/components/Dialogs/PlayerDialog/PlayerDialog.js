import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import './PlayerDialog.scss'
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const PlayerDialog = ({ showPlayerDialog, onClose, player }) => {

  const [playerData, setPlayerData] = useState()
  const [loadingPlayerData, setLoadingPlayerData] = useState(true)

  useEffect(() => {
    if (player) {
      getPlayerData()
    }
  }, [player])


  const getPlayerData = async () => {
    if (player["displayName"]) {
      const res = await fetch(`/history/player?name=${player["displayName"].replace(" ", "_")}&year=2021`, {
        method: "GET",
        headers: {
          "x-access-token": sessionStorage.dfsTrackerToken
        }
      })
      setPlayerData(await res.json())
      setLoadingPlayerData(false)
    }
  }

  return (
    showPlayerDialog && player &&
		  <Dialog open={showPlayerDialog} fullWidth maxWidth="md" className="player-dialog">
        <DialogTitle className="title section">
          <div className="title-inner">
            <div className="player-image">
              <img src={player["playerImageLarge"]} />
            </div>
            <div className="player-info">
              <h3>{player["position"]} <span className="name">{player["displayName"]}</span> {player["team"]}</h3>
              <div className="player-info-inner">
                <div className="game-info">
                  <p>Game: {player["game"]["awayTeam"]} @ {player["game"]["homeTeam"]}</p>
                  <p>Start Time: {player["game"]["startTime"]}</p>
                  <Link to={`/player/${player["displayName"].replace(" ", "_")}`} className="details-link">Player Details <FaAngleRight /></Link>
                </div>
                <div className="draft-info">
                  <div className="info-block">
                    <p>{player["fppg"]}</p>
                    <p>FPPG</p>
                  </div>
                  <div className="info-block">
                    <p>${player["salary"]}</p>
                    <p>Salary</p>
                  </div>
                  <div className="info-block">
                    <p>{player["oprk"]}</p>
                    <p>OPRK</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="icon-block">
              <FaTimes className="close-btn" onClick={onClose} />
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="content section">
          {playerData && playerData["stats"] &&
            <table className="lineups-table">
              <thead>
              <tr className="col-labels">
                  <th colspan="2"></th>
                  <th className="col-label" colSpan="3">Passing</th>
                  <th className="col-label" colSpan="2">Rushing</th>
                  <th className="col-label" colSpan="3">Recieving</th>
                  <th className="col-label" colSpan="1">Misc.</th>
                </tr>
                <tr className="table-header">
                  <th>Week</th>
                  <th>Game</th>
                  <th>YRDs</th>
                  <th>TDs</th>
                  <th>INTs</th>
                  <th>YRDs</th>
                  <th>TDs</th>
                  <th>RECs</th>
                  <th>YRDs</th>
                  <th>TDs</th>
                  <th>FUM Lost</th>
                </tr>
              </thead>
              <tbody>
                {playerData["stats"].reverse().map((week) => 
                <tr>
                  <td>{week["week"]}</td>
                  <td>{week["game"]}</td>
                  <td>{week["passing_yards"]}</td>
                  <td>{week["passing_touchdowns"]}</td>
                  <td>{week["passing_interceptions"]}</td>
                  <td>{week["rushing_yards"]}</td>
                  <td>{week["rushing_touchdowns"]}</td>
                  <td>{week["receptions"]}</td>
                  <td>{week["recieving_yards"]}</td>
                  <td>{week["recieving_touchdowns"]}</td>
                  <td>{week["fumbles_lost"]}</td>
                </tr>
                )}
              </tbody>
            </table>
          }
        </DialogContent>
      </Dialog>
    )
  }

export default PlayerDialog