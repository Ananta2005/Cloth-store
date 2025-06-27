import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from '../Slice/userSlice'
import cartReducer from '../Slice/cartSlice'
import kidReducer from '../Slice/KidSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        cart: cartReducer,
        kids: kidReducer,
    },
})

export default store