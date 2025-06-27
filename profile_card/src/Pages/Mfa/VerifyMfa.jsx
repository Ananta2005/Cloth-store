import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { verify2fa } from '../../Slice/userSlice'
import { useNavigate } from 'react-router-dom'
import './VerifyMfa.css'


const VerifyMfa = () => {

    const [mfaOtp, setMfaOtp] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOtpSubmit = async () => {
        if(!mfaOtp)
        {
            toast.error("Please enter the OTP")
            return
        }

        try
        {
            const response = await dispatch(verify2fa({  mfaOtp }))
            if(response.meta.requestStatus === 'fulfilled')
            {
                toast.success("MFA successful")
                navigate("/profile")
            }
            else
            {
                toast.error("Invalid OTP")
            }
        }
        catch(error)
        {
            toast.error("Error during OTP verification")
        }
    }

  return (
    <div className='mfa-form'>
        <ToastContainer/>
        <h2>Multi-Factor Authentication</h2>
        <input type='text' placeholder='Enter OTP' value={mfaOtp} onChange={(e) => setMfaOtp(e.target.value)} />
        <button onClick={handleOtpSubmit}>Submit OTP</button>
    </div>
  )
}




export default VerifyMfa;