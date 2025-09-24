import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { addProducts, removeProduct, setProducts, updateProduct } from "../../../Slice/ClothSlice"
import KidData from "../../Clothes/Kid/KidData"
import axios from 'axios'
import './Modify.css'
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify"


const Modify = () =>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState("kids")
    const products = useSelector(state => Array.isArray(state.cloth?.products) ? state.cloth.products : [])
    const filteredProducts = products.filter(p => p.category === selectedCategory)
    const [newProduct, setNewProduct] = useState({id:'', name: '', imageFile: null, price: '', rating: '', endDate: '', totalSales: '', category: selectedCategory, description: ''})
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const res = await axios.get('http://localhost:7001/api/products', {withCredentials: true})
                console.log("fetched products:", res.data)
                dispatch(setProducts(res.data))
            }
            catch(err)
            {
                console.error("Failed to fetch products: ", err)
                toast.error("Failed to load products.")
            }
        }
        fetchProducts()
    }, [dispatch])

    useEffect(() => {
        if(!isEditing)
        {
            setNewProduct(prev => ({ ...prev, category: selectedCategory }))
        }
    }, [selectedCategory, isEditing])


    const handleEdit = (product) => {
        setNewProduct({ ...product, description: product.description || '', imageFile: null })
        setEditingId(product.id)
        setIsEditing(true);
    }


    const handleChange = (e) => {
        const {name, value} = e.target
        setNewProduct(prev => ({ ...prev, [name]: value }))
    }


    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setNewProduct(prev => ({ ...prev, imageFile: file }))
    }


    const handleAdd = async () => {

        if(!newProduct.name || !newProduct.imageFile || !newProduct.price)
        {
            alert("Fill all required fields!")
            return
        }

        const formData = new FormData()
        formData.append("name", newProduct.name)
        formData.append("price", newProduct.price)
        formData.append("rating", newProduct.rating)
        formData.append("endDate", newProduct.endDate)
        formData.append("totalSales", newProduct.totalSales)
        formData.append("image", newProduct.imageFile)
        formData.append("category", newProduct.category)
        formData.append("description", newProduct.description)

        try{
            const res = await axios.post('http://localhost:7001/api/products', formData, {withCredentials: true})

            dispatch(addProducts(res.data))
            setNewProduct({id: '', name: '', imageFile: null, price: '', rating: '', endDate: '', totalSales: '', category: selectedCategory})
            toast.success("Product Added")
            setTimeout(() => navigate(`/category/${newProduct.category}`), 1560);
        }
        catch(err)
        {
            console.error("Error adding product:", err)
            toast.error("Failed to add Product.")
        }
    }


    const handleUpdate = async () => {
        try{

            const formData = new FormData()
            formData.append("name", newProduct.name)
            formData.append("price", newProduct.price)
            formData.append("rating", newProduct.rating)
            formData.append("endDate", newProduct.endDate ? newProduct.endDate : null)
            formData.append("totalSales", newProduct.totalSales)
            formData.append("category", newProduct.category)
            formData.append("description", newProduct.description)

            if(newProduct.imageFile)
            {
                formData.append("image", newProduct.imageFile)
            }
            // else if(newProduct.image)
            // {
            //     formData.append("image", newProduct.image)
            // }

            const res = await axios.patch(`http://localhost:7001/api/products/${editingId}`, formData, {withCredentials: true})
            dispatch(updateProduct(res.data))
            setNewProduct({ id: '', name: '', imageFile: null, price: '', rating: '', endDate: '', totalSales: '', category: selectedCategory })
            setIsEditing(false)
            setEditingId(null)
            toast.success("Product Updated")
        }
        catch(err)
        {
            console.error("Error updating product: ", err)
            toast.error("Failed to update product.")
            if(err.response?.data)
            {
                console.error("Server response:", err.response.data)
            }
        }
    } 


    const handleRemove = async (id) => {
        try{
            console.log("Deleting ID:", id)
            await axios.delete(`http://localhost:7001/api/products/${id}`, {withCredentials: true})
            dispatch(removeProduct(id))
            toast.success("Product removed.")
        }
        catch(err)
        {
            console.error("Error deleting Product: ", err)
            toast.error("Failed to remove Product")
        }
    }

    return(
        <div className="modify-container">
            <h2>Modify Products</h2>

            <div className="add-form">
                <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} />
                <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} />
                <input type="number" name="rating" placeholder="Rating" value={newProduct.rating} onChange={handleChange} />
                <input type="date" name="endDate" placeholder="End Date" value={newProduct.endDate} onChange={handleChange} />
                <input type="number" name="totalSales" placeholder="Total Sales" value={newProduct.totalSales} onChange={handleChange} />
                <select name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="kids">Kids</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                </select>
                <textarea name="description" placeholder="Product Description" value={newProduct.description} onChange={handleChange} rows={3} />
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />

                {newProduct.imageFile && (
                    <img  src={URL.createObjectURL(newProduct.imageFile)}  alt="Preview" style={{ width: '100px', marginTop: '10px' }} />
                )}

                <button onClick={isEditing ? handleUpdate : handleAdd}> {isEditing ? "Update Product" : "Add Product" } </button>
            </div>

            <div className="product-list">
                {Array.isArray(products) && filteredProducts.map(prod => (
                    <div key={prod.id} className="product-item">
                        <p>{prod.name}</p>
                        {prod.image && <img src={prod.image} alt={prod.name} width="100" /> }
                        <p>Category: {prod.category}</p>
                        <button onClick={() => handleEdit(prod)}>Edit</button>
                        <button onClick={() => handleRemove(prod.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Modify