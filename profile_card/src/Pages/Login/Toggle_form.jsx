import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, updateProfilePhoto, loginUser, registerUser } from '../../Slice/userSlice'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import './Login.css'



const Toggle_form = ({ isModal =false, onClose }) => {

    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [isMfaPage, setIsMfaPage] = useState(false)
    const isMfaActive = useSelector((state) => state.user.isMfaActive)


    const dispatch = useDispatch()
    const navigate = useNavigate()



    const handleLogin = async () =>{
        if(!username || !password)
            {
              toast.error('Please fill all fields')
              return
            }
            console.log("User data before sending request: ", {username, password})
        // localStorage.setItem('token', 'user_token')
        // dispatch(login({ username, email }))
        // console.log("Login successfully")
        // toast.success("Thanks for Login", {
        //     position: "top-center",
        // })
        // window.dispatchEvent(new Event('storage'))
        // // navigate('/profile')

        try
        {
            const resultAction = await dispatch(loginUser({ username, password }))
            console.log("Login response: ", resultAction)

            const payload = resultAction.payload

            if(resultAction.meta.requestStatus === "fulfilled")
            {
                toast.success("Login successful")
                
                if(payload?.isMfaActive)
                {
                    navigate('/verify-mfa')
                }
                else if(isModal && onClose)
                {
                    onClose();
                }
                else
                {
                    navigate('/setup-mfa')
                }
            }
            else
            {
                toast.error(resultAction.payload || "Login failed")
                if(resultAction.payload === "Email not verified. Please verify your email first.")
                {
                    navigate("/Verify-Email")
                }
            }
        }
        catch(error)
        {
            console.log("Error occured during login: ", error)
            toast.error('Network Error or server Issue')
        }
    }

    const handleSignup = async () =>{
        setIsLogin(true)
        // navigate('/login')
        if(!username || !email || !password)
        {
            toast.error('Please fill all fields')
            return
        }
        
        try
        {
            console.log("User data before sending request: ", { username, email, password })
            const resultAction = await dispatch(registerUser({ username, email, password }))
            console.log("Signup response: ", resultAction)
            if(resultAction.meta.requestStatus === "fulfilled")
            {
                console.log("signup success")
                toast.success("Signup successful. Please check your email for verification.")
                // setTimeout(()=>{
                //     navigate("/Verify-Email")
                // }, 1000)
                navigate("/Verify-Email")
                // <Email/>
            }
            else
            {
                toast.error( "Signup failed 1")
                console.log(resultAction.meta.requestStatus)
            }
        }
        catch(error)
        {
            toast.error("Signup failed")
        }
    }

  return (
    <div className={isModal ? 'modal-overlay' : 'form-body'}>
        <ToastContainer />
        <div className={isModal ? 'modal-content' : 'form-container'}>
            <div className='form-toggle'>
                <button className={isLogin ? 'active' : 'inactive'} onClick={() => setIsLogin(true)}>
                    Login
                </button>
                <button className={!isLogin ? 'active' : 'inactive'} onClick={() => setIsLogin(false)}>
                    Signup
                </button>
            </div>

            {isLogin ? (
                <div className='form'>
                    <h2> Login Form</h2>
                    {/* <input type='text' placeholder= 'ID' /> */}
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={handleLogin}>Login</button>
                    <p>Not a member? <a href='#' onClick={() => setIsLogin(false)}>Signup now</a></p>
                </div>
            ) : (
                
                <div className='form'>
                    <h2>Signup Form</h2>
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type='email' placeholder='Email' value= {email} onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* <input type='password' placeholder='Confirm Password' /> */}
                    <button onClick={handleSignup}>Signup</button>
                </div>
            )}

           {isModal && (
              <button className='cancel' onClick={onClose} style={{ marginTop: '1rem' }}> Close </button>
           )}

        </div>
    </div>
  )
}

export default Toggle_form