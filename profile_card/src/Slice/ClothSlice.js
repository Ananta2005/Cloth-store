import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    products: []
}

const kidSlice = createSlice({
    name: 'cloth',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            if(Array.isArray(action.payload))
            {
               state.products = action.payload
            }
            else
            {
                console.warn("Invalid product payload", action.payload)
                state.products = []
            }
        },

        addProducts: (state, action) => {
            state.products.push(action.payload)
        },

        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload)
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(item => item.id === action.payload.id)
            if(index !== -1)
            {
                state.products[index] = action.payload
            }
        }
    }
})

export const { setProducts, addProducts, removeProduct, updateProduct } = kidSlice.actions
export default kidSlice.reducer