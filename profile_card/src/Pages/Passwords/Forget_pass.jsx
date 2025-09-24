import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { sendForgetPasswordLink } from '../../Slice/PasswordSlice'

export const Forget_pass = () => {

    const [email, setEmail] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = async() => {
        if(!email)
        {
            toast.error("Email is required")
            return
        }
        try
        {
            const result = await dispatch(sendForgetPasswordLink({ email }))
            if(result.meta.requestStatus === "fulfilled")
            {
                toast.success("Password reset link sent to your email.")
            }
            else
            {
                toast.error(result.payload?.message || "Failed to send reset link.")
                console.log(result)
            }
        }
        catch(error)
        {
            toast.error("Something went wrong in forget password.")
        }
    }
  return (
    <div className='flex justify-center items-center'>
        <h2>Forget Password</h2>
        <input className='rounded-1xl' type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button onClick={handleSubmit}>Send reset Link</button>
    </div>
  )
}

export default Forget_pass
