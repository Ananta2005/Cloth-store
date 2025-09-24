import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {resetPassword} from '../../Slice/PasswordSlice'
import { toast } from 'react-toastify'


export const Reset_pass = () => {

    const {token} = useParams()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleReset = async() =>{
        if(password !== confirmPassword)
        {
            toast.error("Password do not match")
            return
        }

        try
        {
            const result = await dispatch(resetPassword({ token, password }))
            if(result.meta.requestStatus === "fulfilled")
            {
                toast.success("Password changed successfully")
                navigate('/profile')
            }
            else
            {
                toast.error("Failed reset password")
            }
        }
        catch(error)
        {
            toast.error("Error resetting password")
        }
    }
  return (
    <div className="flex justify-center items-center">
        <h2>Reset Password</h2>
        <input type="password" placeholder='New Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder='Confirm New Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleReset}>Submit</button>
    </div>
  )
}


export default Reset_pass