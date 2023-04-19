import { useState } from "react"
import './ContactPage.scss'

const ContactPage = () => {

  const [category, setCategory] = useState("feedback")

  const submit = () => {
    console.log("Submitted feedback!")
  }

  return (
    <div className="contact-page">
      <form className="feedback-form">
        <div className='form-header'>
          <h1>Contact Mainslater</h1>
        </div>
        <div className='form-controls'>
          <div className='input-wrapper'>
            <label>Email Address</label>
            <input className="form-control" type="text" placeholder="Enter Email" />
          </div>
          <div className='input-wrapper'>
            <label>Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="feedback" key="feedback">Feedback</option>
              <option value="bug" key="bug">Report Bug</option>
              <option value="help" key="help">Help</option>
              <option value="other" key="other">Other</option>
            </select>
          </div>
        </div>
        <div className="input-wrapper">
          <label>Comments</label>
          <textarea className="form-control"></textarea>
        </div>
        <button className="form-submit-btn">Submit</button>
      </form>
    </div>
  )
}

export default ContactPage