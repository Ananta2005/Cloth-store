import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setup2fa, verify2fa } from '../../Slice/userSlice'
import './SetupMfa.css'

const SetupMfa = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const [qrCode, setQrCode] = useState("")
  // const [secret, setSecret] = useState("")
  const [mfaOtp, setMfaOtp] = useState("")
  const [isLoading, setIsLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)


  const qrCode = useSelector((state) => state.user.qrCode)
  const secret = useSelector((state) => state.user.secret)


  useEffect(() =>{
    dispatch(setup2fa())
        .unwrap()
        .catch((err) => {
           console.error("Setup MFA failed: ", err)
           setError("Failed to setup MFA")
        })
  }, [dispatch])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try
    {
      const result = await dispatch(verify2fa({ mfaOtp }))

      if(result.meta.requestStatus === "fulfilled")
      {
        setSuccess(true)
        navigate("/profile")
      }
      else
      {
        setError("Invlaid verification code")
      }
    }
    catch(err)
    {
      setError("Error verifying MFA")
    }
    finally
    {
      setIsLoading(false)
    }
  }


  return (
    <div className='card'>
        <div className='card-header'>
          <h2>Set up Two-Factor Authentication</h2>
          <p className='text-gray'>
            Scan the QR code with your authenticator app to enhance your account security.
          </p>
        </div>

        <div className='card-content'>
          {error && <div className='alert alert-error'> {error} </div>}
          {success && <div className='alert alert-success'> MFA setup successful! </div>}
           
           <div className='text-center mb-6'>
               {qrCode && (
                  <div className='flex-center mb-4'>
                     <img src={qrCode} alt="QR Code" style={{ height: "200px", width: "200px"}} />
                  </div>
               )}

               <p className='text-sm text-gray mb-2'>
                   If you can't scan the Qr code, enter this code manually in your app:
               </p>
               <code>{secret}</code>
           </div>

           <form onSubmit={handleSubmit}>
               <div className='form-group'>
                  <input
                      id="verification-code"
                      placeholder='Enter the code from you authentication app'
                      value={mfaOtp}
                      onChange={(e) => setMfaOtp(e.target.value)} required 
                      className='form-input' />
               </div>

               <button type="submit" className='btn btn-primary btn-full' disabled={isLoading}>
                   {isLoading ? "Verifying......" : "Verify and Enable"}
               </button>
           </form>

           <div className='text-center mt-4'>
              <p className='text-sm text-gray'>
                 After setting up MFA, you'll be able to access your account securely.
              </p>
           </div>
        </div>
    </div>
  )
}

export default SetupMfa