import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { verifyEmail } from '../../Slice/userSlice'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import './Email.css'
import 'react-toastify/dist/ReactToastify.css'

const Email = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const length = 6
  const [code, setCode]= useState(new Array(length).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [buttonText, setButtonText] = useState('Submit')

  const inputRefs = useRef([])

  useEffect(() => {
    if(inputRefs.current[0])
    {
      inputRefs.current[0].focus()
    }
  }, [])


  const handleOtpChange = (index, e) =>{
    const value = e.target.value
    if(isNaN(value))
      return

    const newOtp = [...code]
    newOtp[index] = value.substring(value.length - 1)
    setCode(newOtp)

    const combinedOtp = newOtp.join("");
    if(combinedOtp.length === length) return "Length of OTP is correct"


    //Move to next Input box if current box is filled
    if(value && index<length-1 && inputRefs.current[index + 1])
    {
      inputRefs.current[index+1].focus()
    }
  }




  const handleClick = (index) =>{

    inputRefs.current[index].setSelectionRange(1, 1)

    if(index>0 && !code[index-1])
    {
      inputRefs.current[code.indexOf("")].focus()
    }
  }



  
  const handleKeyDown =(index, e) => {
    if(e.key === 'Backspace' && !code[index] && index>0 && inputRefs.current[index-1])
    {
      inputRefs.current[index - 1].focus()
    }

  }




  const handleSubmit = async(e) =>{
    e.preventDefault()
    if(!code || code.some((digit) => digit === ""))
    {
      setError('Please enter the OTP.')
      return
    }

    setIsSubmitting(true)
    setButtonText('Verifying...')

    const otpCode = code.join("")
    
    try
    {
      const resultAction = await dispatch(verifyEmail({ code: otpCode }))
       if(resultAction.meta.requestStatus === 'fulfilled')
       {
        toast.success("OTP verified successfully! Redirecting to login...")
        setTimeout(() =>{
          navigate('/login')
        }, 2000)
       }
       else if(resultAction.meta.requestStatus === 'rejected')
       {
        console.log('verification failed')
        toast.error('Verification failed')
       }
       else
       {
        console.log('Unknown error in Email.jsx')
        toast.error('Unknown error in Email.jsx')
       }
    }
    catch(error)
    {
      setError('Invalid OTP or OTP expired.')
      toast.error('An error occurred while verifying OTP.')
    }
    finally
    {
      setIsSubmitting(false)
      setButtonText('Submit')
    }
  }

  return (
    <div>
      <h2>Verify your Email</h2>
      <form onSubmit={handleSubmit} className='otp-Array'>
         { code.map((digit, index) => (
             <input 
                 key={index}
                 type='text'
                 ref={(input) => (inputRefs.current[index] = input)}
                 value={digit}
                 onChange={(e) => handleOtpChange(index, e)}
                 onClick={() => handleClick(index)}
                 onKeyDown={(e) => handleKeyDown(index, e)}
                 className='otpInput'
              />
         ))}
         <button>{buttonText}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Email