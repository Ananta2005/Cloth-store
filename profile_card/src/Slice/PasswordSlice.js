import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    email: null,
    loading: false,
    error: null,
    message: null,
    success: false,
}


export const sendForgetPasswordLink = createAsyncThunk("Password/sendForgetPasswordLink", async({email}, {rejectWithValue}) =>{
    try
    {
        const response = await axios.post("http://localhost:7001/api/auth/forget-password", {email})
        return response.data
    }
    catch(error)
    {
        return rejectWithValue(error.response?.data?.message || "Failed to send reset link")
    }
})

export const resetPassword = createAsyncThunk("Password/resetPassword", async({token, password}, {rejectWithValue}) => {
    try{
        const response = await axios.post(`http://localhost:7001/api/auth/reset-password/${token}`, {password})
        return response.data
    }
    catch(error)
    {
        return rejectWithValue(error.response?.data?.message || "Failed to reset password")
    }
})


export const updatePassword = createAsyncThunk("Password/updatePassword", async({oldPassword, newPassword, email}, {rejectWithValue}) => {
    try
    {
        const response = await axios.post(`http://localhost:7001/api/auth/update-password/${email}`, {oldPassword, newPassword, email})
        return response.data
    }
    catch(error)
    {
        return rejectWithValue(error.response?.data?.message || "Failed to update Password")
    }
})



const PasswordSlice = createSlice({
    name: 'Password',
    initialState,
    reducers: {
        clearPasswordState: (state) => {
            state.loading = false
            state.error = null
            state.message = null
            state.success = false
        },
    },

    extraReducers: (builder) => {
        builder.addCase(sendForgetPasswordLink.pending, (state) => {
            state.loading = true
            state.error = null
            state.message = null
            state.success = false
        })

        .addCase(sendForgetPasswordLink.fulfilled, (state, action) => {
            state.loading = false
            state.message = action.payload.message || "Reset link sent successfully."
            state.success = true
        })

        .addCase(sendForgetPasswordLink.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.success = false
        })

        .addCase(resetPassword.pending, (state) => {
            state.loading = true
            state.error = null
            state.message = null
            state.success = false
        })

        .addCase(resetPassword.fulfilled, (state, action) =>{
            state.loading = false
            state.message = action.payload.message || "Password reset successful."
            state.success = false
        })

        .addCase(updatePassword.pending, (state) => {
            state.loading = true
            state.error = null
            state.message = null
            state.success = false
        })

        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false
            state.message = action.payload.message || "Password updated successfully."
            state.success = true
        })

        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.success = false
        })
    }
})

export const {clearPasswordState} = PasswordSlice.actions
export default PasswordSlice.reducer