import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    products: []
}

const kidSlice = createSlice({
    name: 'kids',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
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