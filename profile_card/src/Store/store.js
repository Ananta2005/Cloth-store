import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from '../Slice/userSlice'
import cartReducer from '../Slice/cartSlice'
import clothReducer from '../Slice/ClothSlice'
import passwordReducer from '../Slice/PasswordSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        cart: cartReducer,
        cloth: clothReducer,
        Password: passwordReducer
    },
})

export default store