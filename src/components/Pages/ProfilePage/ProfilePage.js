import './ProfilePage.scss'
import { useState, useEffect } from 'react'

const ProfilePage = () => {

  const [user, setUser] = useState()

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = () => {
    // const res = await fetch(`/user/test`, {
    //   method: 'GET',
    //   headers: {
    //     'x-access-token': sessionStorage.dfsTrackerToken
    //   }
    // })
    // const data = await res.json()
    setUser({
      "username": "nroth12", 
      "created": "February 3, 2023",
      "lineups": "34",
      "email": "nolanrroth12@gmail.com"  
    })
  }

  const saveProfileSettings = () => {
    console.log("Saved settings!")
    // const res = await fetch(`/user/`, {
    //   method: 'POST',
    //   headers: {
    //     'x-access-token': sessionStorage.dfsTrackerToken
    //   }
    // })
    // const data = await res.json()
    // return data['players']
  }

  const cancelChanges = () => {
    console.log("Undoing changes!")
  }

  return (
    <div className='profile-page'>
      {user &&
        <div className='profile-page-wrapper'>
          <div className='profile-page-inner'>
            <h1>Profile</h1>
            <div className='info'>
              <div className='info-line'>
                <p>Username: {user["username"]}</p>
              </div>
              <div className='info-line'>
                <p>Created: {user["created"]}</p>
              </div>
              <div className='info-line'>
                <p>Email: {user["email"]}</p>
                <button>Change</button>
              </div>
              <div className='info-line'>
                <p>Total Lineups: {user["lineups"]}</p>
                <button>Export</button>
              </div>
              <div className='info-line'>
                <button>Change Password</button>
              </div>
            </div>
          </div>
        </div>
    }
    </div>
  )
}

export default ProfilePage