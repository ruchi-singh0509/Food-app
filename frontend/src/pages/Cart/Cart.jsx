import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import SEO from '../../components/SEO/SEO'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext)
  const navigate = useNavigate();
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  return (
    <main className='cart' aria-labelledby="cart-heading">
      <SEO 
        title="Shopping Cart - Review Your Order"
        description="Review your food order, adjust quantities, and proceed to checkout. Fast and secure payment options available."
        keywords="food cart, checkout, online order, food delivery cart"
      />
      <h1 id="cart-heading" className="visually-hidden">Shopping Cart</h1>
      
      <section className="cart-items" aria-label="Cart items">
        <div className="cart-items-title" role="row" aria-rowindex="1">
          <div role="columnheader">Items</div>
          <div role="columnheader">Title</div>
          <div role="columnheader">Price</div>
          <div role="columnheader">Quantity</div>
          <div role="columnheader">Total</div>
          <div role="columnheader">Remove</div>
        </div>
        <br />
        <hr />
        
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} role="rowgroup">
                <div className="cart-items-title cart-items-item" role="row" aria-rowindex={index + 2}>
                  <div role="cell">
                    <img src={url+"/images/"+item.image} alt={item.name} />
                  </div>
                  <div role="cell">{item.name}</div>
                  <div role="cell" aria-label={`Price: ${item.price} dollars`}>${item.price}</div>
                  <div role="cell" aria-label={`Quantity: ${cartItems[item._id]}`}>{cartItems[item._id]}</div>
                  <div role="cell" aria-label={`Total: ${item.price * cartItems[item._id]} dollars`}>${item.price * cartItems[item._id]}</div>
                  <div role="cell">
                    <button 
                      className="remove-button" 
                      onClick={() => removeFromCart(item._id)} 
                      onKeyDown={(e) => handleKeyDown(e, () => removeFromCart(item._id))}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <span className='cross' aria-hidden="true">x</span>
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </section>
      <div className="cart-bottom">
        <section className="cart-total" aria-labelledby="cart-total-heading">
          <h2 id="cart-total-heading">Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <span>Subtotal</span>
              <span aria-label={`Subtotal: ${getTotalCartAmount()} dollars`}>${getTotalCartAmount()}</span>
            </div>
            <hr />
            <div className="cart-total-details">
              <span>Delivery Charges</span>
              <span aria-label={`Delivery charges: ${getTotalCartAmount()===0?0:2} dollars`}>${getTotalCartAmount()===0?0:2}</span>
            </div>
            <hr />
            <div className="cart-total-details">
              <strong>Total</strong>
              <strong aria-label={`Total: ${getTotalCartAmount()===0?0:getTotalCartAmount()+2} dollars`}>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</strong>
            </div>
          </div>
          <button 
            onClick={() => navigate('/order')}
            onKeyDown={(e) => handleKeyDown(e, () => navigate('/order'))}
            aria-label="Proceed to checkout"
          >
            Proceed To Checkout
          </button>
        </section>
        
        <section className="cart-promocode" aria-labelledby="promo-heading">
          <div>
            <h3 id="promo-heading">Have a promo code? Enter it here</h3>
            <div className='cart-promocode-input' role="form" aria-labelledby="promo-heading">
              <label htmlFor="promocode" className="visually-hidden">Promo code</label>
              <input 
                type="text" 
                id="promocode"
                name="promocode"
                placeholder='promocode' 
                aria-label="Enter promo code"
              />
              <button 
                type="submit"
                aria-label="Apply promo code"
              >
                Submit
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Cart