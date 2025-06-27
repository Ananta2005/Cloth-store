import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    // totalQuantity : 0,
    totalAmount: localStorage.getItem('cartTotalAmount') ? JSON.parse(localStorage.getItem('cartTotalAmount')) : 0,
}




export const paymentOut = createAsyncThunk("cart/payment", async({items, email, sessionId}, {rejectWithValue }) => {
    try
    {
        const response = await axios.post("http://localhost:7001/api/auth/payment-checkOUT", {
            items, email, sessionId,
        }, { withCredentials: true})

        return response.data.id
    }
    catch(error)
    {
        console.log("Stripe Checkout Error:", error)
        return rejectWithValue(error.message || "Checkout failed")
    }
})




const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            console.log("Adding item to cart: ", action.payload)
            const newItem = action.payload
            const existingItem = state.items.find(item => item.id === newItem.id)

            if(existingItem)
            {
                existingItem.quantity += 1
                existingItem.totalPrice += newItem.price
            }
            else
            {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                })
            }

            // state.totalQuantity +=1
            state.totalAmount += newItem.price
            localStorage.setItem('cartItems', JSON.stringify(state.items))
            localStorage.setItem('cartTotalAmount', JSON.stringify(state.totalAmount))

        },

        removeItem: (state, action) => {
            const id = action.payload
            const existingItem = state.items.find((item) => item.id === id)

            if(existingItem)
            {
                // state.totalQuantity -= existingItem.quantity
                state.totalAmount -= existingItem.totalPrice
                state.items = state.items.filter((item) => item.id !== id)
            }

            localStorage.setItem('cartItems', JSON.stringify(state.items))
            localStorage.setItem('cartTotalAmount', JSON.stringify(state.totalAmount))
        },

        clearCart: (state) => {
            state.items = []
            // state.totalQuantity = 0;
            state.totalAmount = 0

            localStorage.removeItem('cartItems')
            localStorage.removeItem('cartTotalAmount')
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(paymentOut.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(paymentOut.fulfilled, (state) => {
                state.status = "succeeded"
            })
            .addCase(paymentOut.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
    }
})

export const { addItem, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer