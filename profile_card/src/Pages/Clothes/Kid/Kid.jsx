import React from 'react';
import { useSelector } from 'react-redux';
import './Kid.css';
import { FaShoppingCart, FaRegBookmark, FaStar, FaFireAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import slide1 from '../../../assets/slide1.jpg';
import slide2 from '../../../assets/slide2.jpg';
import slide3 from '../../../assets/slide3.jpg';
import slide4 from '../../../assets/slide4.jpg';
import { addItem } from '../../../Slice/cartSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const Kid = () => {

    const dispatch = useDispatch()
    const products = useSelector(state => state.kids.products)

    const handleAddToCart = (item) => {
        dispatch(addItem({
            id: item.id,
            name: item.name,
            price: item.price,
        }))
        toast.success(`${item.name} added to the cart!`, {
            position: 'top-center',
        })
    }

    return (
        <div className='myComponent'>
            <ToastContainer />
            <div>
                <h1 className='heading'>Kid Shopping Mall</h1>

                <Swiper
                    className='swiper-container'
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]} 
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
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
                    <div key={item.id} className='productCard'>
                        <img src={item.image} alt='product-img' className='productImage' />

                        
                        <FaRegBookmark className={"productCard_wishlist"} />
                        <FaFireAlt className={"productCard_fastSelling"} />

                        <div className='productCard_content'>
                            <h3 className='productName'>{item.name}</h3>
                            <div className='displayStack__1'>
                                <div className='productPrice'>${item.price}</div>
                                <div className='productSales'>{item.totalSales} units sold</div>
                            </div>

                            <div className='displayStack__2'>
                                <div className='productRating'>
                                    {[...Array(Math.floor(item.rating))].map((_, index) => (
                                        <FaStar id={index + 1} key={index} />
                                    ))}
                                    {item.rating % 1 !== 0 && <FaStar style={{ opacity: 0.5 }} />}
                                </div>
                                <div className='productTime'>{item.timeLeft} days left</div>
                            </div>
                            <FaShoppingCart className={"productCard_cart"}
                            
                                    onClick={()=> handleAddToCart(item)}
                            />
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kid;
