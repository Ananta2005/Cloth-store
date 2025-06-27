import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { addProducts, removeProduct, setProducts } from "../../../Slice/KidSlice"
import KidData from "../../Clothes/Kid/KidData"
import axios from 'axios'

const Modify = () =>{
    const dispatch = useDispatch()
    const products = useSelector(state => state.kids?.products || [])
    const [newProduct, setNewProduct] = useState({id:'', name: '', image: '', price: '', rating: '', timeLeft: '', totalSales: ''})
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const res = await axios.get('/api/products')
                dispatch(setProducts(res.data))
            }
            catch(err)
            {
                console.error("Failed to fetch products: ", err)
            }
        }
        fetchProducts()
    }, [])


    const handleEdit = (product) => {
        setNewProduct(product)
        setEditingId(product.id)
        setIsEditing(true);
    }


    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
    }



    const handleAdd = async () => {

        if(!newProduct.name || !newProduct.image || !newProduct.price)
        {
            alert("Fill all required fields!")
            return
        }

        try{
            const res = await axios.post('/api/products', newProduct, {
                headers: {Authorization: `Bearer ${token}` }
            })

            dispatch(addProducts(res.data))
            setNewProduct({id: '', name: '', image: '', price: '', rating: '', timeLeft: '', totalSales: ''})
        }
        catch(err)
        {
            console.error("Error adding product:", err)
        }
    }


    const handleUpdate = async () => {
        try{
            const res = await axios.put(`/api/products/${editingId}`, newProduct, {
                headers: {Authorization: `Bearer ${token}` }
            })
            dispatch(updateProduct({ ...newProduct, price: +newProduct.price, rating: +newProduct.rating, timeLeft: +newProduct.timeLeft, totalSales: +newProduct.totalSales}))
            setNewProduct({ id: '', name: '', image: '', price: '', rating: '', timeLeft: '', totalSales: '' })
            setIsEditing(false)
            setEditingId(null)
        }
        catch(err)
        {
            console.error("Error updating product: ", err)
        }
    } 


    const handleRemove = async (id) => {
        await axios.delete(`/api/products/${id}`, {
            headers: {Authorization: `Bearer ${token}` }
        })
        dispatch(removeProduct(id))
    }

    return(
        <div className="modify-container">
            <h2>Modify Products</h2>

            <div className="add-form">
                {["name", "image", "price", "rating", "timeLeft", "totalSales"].map((field) => (
                    <input key={field} name={field} placeholder={field} value={newProduct[field]} onChange={handleChange} />
                ))}
                <button onClick={isEditing ? handleUpdate : handleAdd}> {isEditing ? "Update Product" : "Add Product" } </button>
            </div>

            <div className="product-list">
                {products.map(prod => (
                    <div key={prod.id} className="product-item">
                        <p>{prod.name}</p>
                        <button onClick={() => handleEdit(prod)}>Edit</button>
                        <button onClick={() => handleRemove(prod.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Modify