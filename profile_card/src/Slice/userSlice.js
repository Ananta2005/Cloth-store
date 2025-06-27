import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'



const initialState = {
    isAuthenticated: !!localStorage.getItem('token'), //false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    email: localStorage.getItem('email') || null,
    profilePhoto: localStorage.getItem('profilePhoto') || null,
    isMfaActive: false,
    token: localStorage.getItem('token') || null,
    qrCode: null,
    secret: null,
    status: null,
    error: null,
}



export const registerUser = createAsyncThunk("user/register", async({username, email, password}, { rejectWithValue }) =>{
    try
    {
        const response = await axios.post("http://localhost:7001/api/auth/register", {"name":username, email, password}, {withCredentials: true})
        return response.data
    }
    catch(error)
    {
        return rejectWithValue(error.message)
    }
})


export const verifyEmail = createAsyncThunk("user/email", async({code}, {rejectWithValue}) => {
    try
    {
        const response = await axios.post("http://localhost:7001/api/auth/verifyEmail", { code }, {withCredentials: true})
        return response.data
    }
    catch(error)
    {
        console.error("Error in verifyEmail API:", error.response ? error.response.data : error.message)
        return rejectWithValue(error.message || "Failed in verify email")
    }
})




export const verify2fa = createAsyncThunk("user/Verifymfa", async({mfaOtp}, {rejectWithValue, getState }) => {
    try
    {
        const token = localStorage.getItem("token") || getState().user.token
        if(!token) throw new Error("No token found for MFA verification")
            
        const response = await axios.post("http://localhost:7001/api/auth/2fa/verify", 
            {mfaToken: mfaOtp}, 
            {
                withCredentials: true, 
                headers:{Authorization: `Bearer ${token}` },
            }
        )
        return response.data
    }
    catch(error)
    {
        console.error("MFA is not verifying", error)
        return rejectWithValue(error.message || "Failed to verify MFA")
    }
})



export const setup2fa = createAsyncThunk("user/Setupmfa", async(_, { getState, rejectWithValue}) => {
    try
    {
        const token = localStorage.getItem("token") || getState().user.token
        const response = await axios.post("http://localhost:7001/api/auth/2fa/setup", {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
         })
        return response.data
    }
    catch(error)
    {
        console.error("Qr code is not appearing", error)
        return rejectWithValue(error.message || "qr code is not view")
    }
})




export const loginUser = createAsyncThunk("user/login", async({username, password}, {rejectWithValue}) =>  {
    try
    {
        console.log("sending login request with: ", username)
        const response = await axios.post("http://localhost:7001/api/auth/login", {"name":username, password}, { headers:{ "Content-Type": "application/json" }, withCredentials: true})
        return response.data
    }
    catch(error)
    {
        if(error.response && error.response.status === 401)
        {
             return rejectWithValue("Email not verified. Please verify your email first.")
        }
        return rejectWithValue(error.message || "Login Failed")
    }
    
})


export const fetchUserDetails = createAsyncThunk("user/fetchDetails", async(_, {rejectWithValue}) =>{
    try
    {
        const {data} = await axios.get("http://localhost:7001/api/auth/user", { withCredentials:true})
        return data
    }
    catch(error)
    {
        return rejectWithValue(error.message || "Failed to fetch user")
    }
})


export const logoutUser = createAsyncThunk("user/logout", async(_, {rejectWithValue}) => {
    try
    {
        await axios.post("http://localhost:7001/api/auth/logout", {}, {withCredentials: true})
        return true
    }
    catch(error)
    {
        return rejectWithValue(error.message || "Logout failed");
    }
})






const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = !action.payload.isMfaActive
            state.user = action.payload
            state.isMfaActive = action.payload.isMfaActive || false
            localStorage.setItem('user', JSON.stringify(action.payload))
            localStorage.setItem('email', action.payload.email)
            localStorage.setItem('token', action.payload.token)
            state.token = action.payload.token
            localStorage.setItem('profilePhoto', action.payload.profilePhoto || "")
        },
        logout: (state) =>{
            state.isAuthenticated= false
            state.user = null
            state.profilePhoto = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('profilePhoto')
            localStorage.removeItem('email')
            localStorage.clear()
        },
        updateProfilePhoto: (state, action) =>{
            state.isAuthenticated = true
            state.profilePhoto = action.payload
            localStorage.setItem('profilePhoto', action.payload.profilePhoto)
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.isAuthenticated= !action.payload.isMfaActive
                state.isMfaActive = action.payload.isMfaActive || false
                state.user = action.payload
                localStorage.setItem("user", JSON.stringify(action.payload))
                localStorage.setItem("email", action.payload.email)
                if(action.payload.token)
                {
                    state.token=action.payload.token
                    localStorage.setItem("token", action.payload.token)
                }
                
            })
            // .addCase(loginUser.rejected, (state, action) => {
            //     state.status = "failed"
            //     state.error = action.payload
            // })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.isAuthenticated= false
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false
                state.user = null
                localStorage.clear()
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.isAuthenticated = true
                state.email = action.payload
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isAuthenticated = false,
                state.status = "failed"
                console.log('Error in verifyEmail:', action.payload)
            })
            .addCase(verify2fa.fulfilled, (state, action) => {
                state.isMfaActive = true,
                state.isAuthenticated = true,
                localStorage.setItem("token", action.payload.token)
            })
            .addCase(setup2fa.fulfilled, (state, action) => {
                state.qrCode = action.payload.qrCode,
                state.secret = action.payload.secret,
                console.log("The Qr code successfull appear", action.payload)
            })
            .addCase(setup2fa.rejected, (state, action) => {
                state.qrCode = false,
                state.secret = false,
                console.log("Error in appearing Qr Code", action.payload)
            })
    }
})

export const { login, logout, updateProfilePhoto} = userSlice.actions



export default userSlice.reducer