import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout, updateProfilePhoto } from '../../Slice/userSlice'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {

  const { user, profilePhoto } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () =>{
    dispatch(logout())
    navigate('/')
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    
    if(file)
    {
      const fileURL = URL.createObjectURL(file)
      dispatch(updateProfilePhoto(fileURL))
      localStorage.setItem('profilePhoto', fileURL)
    }
  }

  useEffect(() =>{
    if(!user){
      console.log('User data not found.')
    }
  }, [user])


  if (!user) {
    return (
      <div className="profile-page-container">
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-text">User Data Not Found. Please Login.</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className='profile-page-container'>
      <div className='profile-card'>
        <h1 className='profile-title'>Profile</h1>


        <div className="profile-photo-container">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className='profile-photo' />
            ) : (
              <div className='default-photo'> No Photo </div>
            )}

            <input type='file' accept='image/*' onChange={handleFileChange} className='upload-button' />
        </div>


        <p className='profile-text'>
          <strong>Username: </strong> {user?.username}
        </p>
        <p className='profile-text'>
          <strong>Email:</strong> {user?.email}
        </p>

        <button className='logout-button' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile