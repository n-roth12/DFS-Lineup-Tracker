import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import './GamesSlider.scss'

const GamesSlider = ({ games, selectedWeek, selectedYear }) => {

  const listRefGames = useRef()

  const handleClick = (direction, ref) => {
    const left_pos = ref.current.getBoundingClientRect().x - 270
    if (direction === "left" && left_pos < 0) {
      ref.current.style.transform = `translateX(${left_pos + 400}px)`
    } else if (direction === "right") {
      ref.current.style.transform = `translateX(${left_pos - 400}px)`
    }
  }

  const alterGame = (game) => {
    return game.replace("@", "-")
  }

  return (
    <div className="games-slider">
      <h1>Games:</h1>
      <div className="games-row-outer"> 
        <button 
          className="left-paddle paddle" 
          onClick={() => handleClick("left", listRefGames)} >
            <FaAngleLeft className="slider-icon" />
        </button>
        <div className="games-row-wrapper">
          <div className="games-row" ref={listRefGames}>
          {games.map((game) =>
            <div className="research-card">
              <span><Link className="game-link" to={`/research/${game["home"]}`}>{game["home"]}</Link></span>
              <span>@</span>
              <span><Link className="game-link" to={`/research/${game["away"]}`}>{game["away"]}</Link></span>
              <span><Link className="game-link" to={`/research/${alterGame(game["game"])}/${selectedWeek}/${selectedYear}`}>Details</Link></span>
            </div>
          )}
          </div>
        </div>
        <button 
          className="right-paddle paddle" 
          onClick={() => handleClick("right", listRefGames)}>
            <FaAngleRight className="slider-icon" />
        </button>
      </div>
    </div>
  )
}

export default GamesSlider