import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfilePhoto } from '../../Slice/userSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.email);
  const profilePhoto = useSelector((state) => state.user.profilePhoto);

  const handleLogout = () => dispatch(logout());

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => dispatch(updateProfilePhoto(reader.result));
    reader.readAsDataURL(file);
  };

  return (

      <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>

          <h2 className='text-gray-800 font-extrabold text-3xl mb-6'>Profile</h2>

          <div className='flex flex-col items-center mb-6'>
            {profilePhoto ? (
              <img src={profilePhoto} alt='Profile' className='w-24 h-24 rounded-full object-cover border-2 border-gray-300' />
            ) : (
              <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm'>No Image</div>
            )}

            <label className='mt-3 inline-block cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition duration-300'>
              Upload Photo
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
            </label>
          </div>

          <div className='text-left mb-4'>
            <p className='text-gray-700 mb-2'>
              <strong>Name: </strong> {user?.name || 'N/A'}
            </p>
            <p className='text-gray-700'>
              <strong>Email: </strong> {user?.email || 'N/A'}
            </p>
          </div>

          <div className='flex justify-start mt-4'>
            <button onClick={handleLogout} className='bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300'>
              Logout
            </button>
          </div>
          <div className='flex justify-end mt-4'>
            <button onClick={() => navigate('/update-password')} className='bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300'>
              Update Password
            </button>
          </div>
        </div>
      </div>
  );
};

export default Profile;
