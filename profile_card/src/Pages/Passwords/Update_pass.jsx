import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPasswordState, updatePassword } from '../../Slice/PasswordSlice'


const Update_pass = () => {

  const dispatch = useDispatch()
  const email = useSelector((state) => state.user.email)
  const {loading, error, message, success} = useSelector((state) => state.Password)
  
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    return () => {
      dispatch(clearPasswordState())
    }
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError(null)

    if(!oldPassword || !newPassword || !confirmNewPassword)
    {
      setValidationError("Please fill all Fields")
      return
    }

    if(newPassword !== confirmNewPassword)
    {
      setValidationError('New Password does not match')
      return
    }

    if(newPassword.length < 6)
    {
      setValidationError('New password must be of length 6')
      return
    }

    dispatch(updatePassword({ oldPassword, newPassword, email }))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label  className="block mb-1 font-medium">Old Password</label>
            <input type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}  placeholder='Old Password'  className='w-full border px-3 py-2 rounded' required />
          </div>

          <div className='mb-4'>
            <label className="block mb-1 font-medium">New Password</label>
            <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' className='w-full border px-3 py-2 rounded' required />
          </div>

          <div className='mb-4'>
            <label className="block mb-1 font-medium"> Confirm New Password</label>
            <input type='password' value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder='Confirm New Password' className='w-full border px-3 py-2 rounded' required />
          </div>

          {validationError && (
            <div className='mb-4 text-red-600 font-semibold'>{validationError}</div>
          )}

          {/* //API error */}
          {error && (
            <div className='mb-4 text-red-600 font-semibold'>{error}</div>
          )}

          {success && message && (
            <div className='mb-4 text-green-600 font-semibold'>{message}</div>
          )}


          <button type='submit'  disabled={loading}  className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Updating....' : 'Update Password'}
          </button>

        </form>
    </div>
  )
}

export default Update_pass