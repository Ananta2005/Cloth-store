import React, { useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react"
import SplineC from '../../Spline/SplineC'
import Toggle_form from './Toggle_form'
import './Login.css'

const Login = () => {

  // const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0()
  // console.log("Current User", user)

  return (

    <div className="login-page">
         <Toggle_form /> 
          {/* {isAuthenticated && <h1>Welcome {user.name}</h1>}
        {isAuthenticated ? (<button onClick={(e) => logout()}>Logout</button>) : (<button onClick={(e) => loginWithRedirect()}>Login</button>)} */}

    </div>
  )
}

export default Login
