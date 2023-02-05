import { useState, useEffect } from "react"
import './FeedbackPage.scss'

const FeedbackPage = () => {

  const submit = () => {
    console.log("Submitted feedback!")
  }

  return (
    <div className="feedback-page">
      <div className="feedback-form-wrapper">
        <div className="feedback-form">
          <h1>Submit Feedback</h1>
          <p className="info">
            I greatly appreciate any constructive feedback, as I am always looking to improve
            this site. If there is a feature missing from the site that you would like to see,
            please let me know here. Thank you for using Mainslater! 
          </p>
          <input type="text"></input>
          <button className="form-submit-btn">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage