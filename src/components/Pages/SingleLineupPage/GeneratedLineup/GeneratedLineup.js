
const GeneratedLineup = ({ lineup }) => {
  return (
    <div className="generated-lineup">
      {lineup && lineup.length > 0 && lineup.map((player) => 
        <div className="player">
          <p>{player["firstName"]} {player["lastName"]}</p>
        </div>
      )}
    </div>
  )
}

export default GeneratedLineup