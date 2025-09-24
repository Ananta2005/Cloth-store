import React, { useEffect, useState } from 'react'
import './Woman.css'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '../../../Slice/ClothSlice'
import { addItem } from '../../../Slice/cartSlice'
import { toast, ToastContainer } from 'react-toastify'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules'
import { FaFireAlt, FaRegBookmark, FaShoppingCart, FaStar } from 'react-icons/fa'
import axios from 'axios'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import slide1 from '../../../assets/slide1.jpg';
import slide2 from '../../../assets/slide2.jpg';
import slide3 from '../../../assets/slide3.jpg';
import slide4 from '../../../assets/slide4.jpg';

const Woman = () => {

  const dispatch = useDispatch()
  const allProducts = useSelector((state) => state.cloth.products || [])
  const products = allProducts.filter(prod => prod.category === "women")

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [productRating, setProductRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [userRating, setUserRating] = useState('')

  useEffect(() => {
    axios.get('http://localhost:7001/api/products', {withCredentials: true})
         .then((res) => {dispatch(setProducts(res.data))})
         .catch((err) => {console.log("Error Fetching products in Women.jsx: ", err)})
  }, [dispatch])

  useEffect(() => {
    if(selectedProduct)
    {
      axios.get(`http://localhost:7001/api/ratings/${selectedProduct.id}`, {withCredentials: true})
           .then(res => {
                 setProductRating(res.data.averageRating)
                 setTotalRatings(res.data.totalRatings)
           })
           .catch(err => console.error("Failed to fetch rating", err)) 
    }
  }, [selectedProduct])


  const handleAddToCart = (item) => {
    dispatch(addItem({ id: item.id, name: item.name, price: item.price }))
    toast.success(`${item.name} added to cart`, { position: 'top-center',})
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }


  const submitRating = async(rating) => {
    // const token = localStorage.getItem("token")

    // if(!token)
    // {
    //   toast.error("You must be logged in to rate a product")
    //   return
    // }
    try
    {
       await axios.post('http://localhost:7001/api/ratings', {
         productId: selectedProduct.id,
         ratingValue: Number(rating),
       }, {withCredentials: true})
       toast.success("Rating submitted")
       setUserRating('')
       const res = await axios.get(`http://localhost:7001/api/ratings/${selectedProduct.id}`, {withCredentials: true})
       setProductRating(res.data.averageRating)
       setTotalRatings(res.data.totalRatings)
    }
    catch(err)
    {
      toast.error("Failed to submit rating")
    }
  }

  const calculateTimeLeft = (endDate) => {
    const diff = new Date(endDate) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }


  return (
    <div className='myComponent'>
      <ToastContainer />
      <div>
         <h1 className='heading'>Woman Shopping Mall</h1>

         <Swiper
              className='swiper-container'
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={50}
              slidesPerView={1} 
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false, }}
              effect="coverflow"
          >
            <SwiperSlide className='swiper-slide'>
              <img src={slide1} alt='image1' loading='lazy' />
            </SwiperSlide>
            <SwiperSlide className='swiper-slide'>
              <img src={slide2} alt='image2' loading='lazy' />
            </SwiperSlide>
            <SwiperSlide className='swiper-slide'>
              <img src={slide3} alt='image3' loading='lazy' />
            </SwiperSlide>
            <SwiperSlide className='swiper-slide'>
              <img src={slide4} alt='image4' loading='lazy' />
            </SwiperSlide>
          </Swiper>
      </div>


      <div className='productList'>
        {products.map((item) => (
            <div key={item.id} className='productCard' onClick={() => handleProductClick(item)}>
               <img src={item.image} alt='product-img' className='productImage' />

               <FaRegBookmark className={"productCard_wishlist"} />
               <FaFireAlt className={"productCard_fastSelling"} />

               <div className='productCard_content'>
                  <h3 className='productName'>{item.name}</h3>
                  <div className='displayStack__1'>
                      <div className='productPrice'>${item.price}</div>
                      <div className='productSales'>{item.totalSales} units sold</div>
                  </div>

                  <div className='dispalyStack__2'>
                     <div className='productTime'>{item.endDate ? `${calculateTimeLeft(item.endDate)} days left` : 'Out of stock'}</div>
                  </div>
                  <FaShoppingCart className={"productCard_cart"} onClick={() => handleAddToCart(item)} />
                </div>
             </div>
        ))}
      </div>

      {showModal && selectedProduct && (
          <div className='modal-overlay' onClick={() => setShowModal(false)}>
               <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                   <div className='modal-body'>
                        <div className='modal-image'>
                          <img src={selectedProduct.image} alt={selectedProduct.name} />
                        </div>
                        <div className='modal-description'>
                            <h2>{selectedProduct.name}</h2>
                            <p><strong>Description:</strong> {selectedProduct.description || "No description available" } </p>
                            <p><strong>Rating:</strong> {[...Array(Math.floor(productRating))].map((_, i) => <FaStar key={i} />)} {productRating % 1 !== 0 && <FaStar style={{ opacity: 0.5}} />} ({totalRatings} ratings) </p>
                            <p><strong>Time left:</strong> {selectedProduct.endDate ? `${calculateTimeLeft(selectedProduct.endDate)} days left` : 'Out of Stock'} </p>
                        </div>
                   </div>
                   <div className='user-rating'>
                      <label>Rate this product: </label>
                      <select value={userRating} onChange={(e) => setUserRating(e.target.value)}>
                        <option value="">Select</option>
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <button onClick={() => submitRating(userRating)}> Submit Rating</button>
                   </div>
                   <div className='modal-footer'>
                            <p><strong>Price:</strong> ${selectedProduct.price}</p>
                            <button onClick={() => handleAddToCart(selectedProduct)}>Add To Cart</button>
                            <button onClick={() => setShowModal(false)}>Close</button>
                   </div>
                </div>
            </div>
        )}
        
    </div>
  )
}

export default Woman