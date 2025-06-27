import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, clearCart, paymentOut } from '../../Slice/cartSlice'
import { loadStripe } from "@stripe/stripe-js"
import './Cart.css'
import { v4 as uuidv4 } from 'uuid'


console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


const Cart = () => {

  const cartItems = useSelector((state) => state.cart.items)
  const totalAmount = useSelector((state) => state.cart.totalAmount)
  const dispatch = useDispatch()
  const email = useSelector((state) => state.user.user?.email)



  const handleCheckout = async () =>{
    const stripe = await stripePromise
    const sessionId = uuidv4()

    try
    {
      const result = await dispatch(paymentOut({ items: cartItems, email, sessionId }))
      if(paymentOut.fulfilled.match(result))
      {
        const sessionId = result.payload
        const redirect = await stripe.redirectToCheckout({ sessionId })

        if(redirect.error)
        {
          console.log(redirect.error.message)
        }
        else
        {
          console.error("Checkout failed: ", result.payload)
        }
      }
    }
    catch(err)
    {
      console.log("Checkout Dispatch Error: ", err)
    }
  }


  return (
    <div className='cart-container'>
        <h1>Shopping Cart</h1>
        
            {cartItems.length === 0 ? (
              <p>Your Cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total: ${item.totalPrice}</p>
                        <button className='clear-cart-btn' onClick={() => dispatch(removeItem(item.id))}>
                          Remove Item
                        </button>
                    </li>
                ))}
              </ul>
            )}
        
        {cartItems.length > 0 && (
          <>
            <h2>Total Amount: ${totalAmount}</h2>
            <button onClick={() => dispatch(clearCart())}>Clear cart</button>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
          </>
        )}
        
    </div>
  )
}

export default Cart