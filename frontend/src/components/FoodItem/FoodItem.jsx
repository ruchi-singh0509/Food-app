import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {
    const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
    
    // Handle keyboard events for accessibility
    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };
    
    return (
        <article className='food-item' aria-labelledby={`food-item-${id}-name`}>
            <div className="food-item-img-container">
                <img 
                    className='food-item-image' 
                    src={url+"/images/"+image} 
                    alt={`${name} food item`} 
                />
                {
                    !cartItems[id] ? (
                        <button 
                            className='add-button' 
                            onClick={() => addToCart(id)} 
                            onKeyDown={(e) => handleKeyDown(e, () => addToCart(id))}
                            aria-label={`Add ${name} to cart`}
                        >
                            <img className='add' src={assets.add_icon_white} alt='' aria-hidden="true" />
                        </button>
                    ) : (
                        <div 
                            className='food-item-counter'
                            role="group"
                            aria-label={`${name} quantity controls`}
                        >
                            <button 
                                onClick={() => removeFromCart(id)}
                                onKeyDown={(e) => handleKeyDown(e, () => removeFromCart(id))}
                                aria-label={`Remove one ${name} from cart`}
                            >
                                <img src={assets.remove_icon_red} alt="" aria-hidden="true" />
                            </button>
                            <p aria-live="polite" aria-atomic="true">{cartItems[id]}</p>
                            <button 
                                onClick={() => addToCart(id)}
                                onKeyDown={(e) => handleKeyDown(e, () => addToCart(id))}
                                aria-label={`Add one more ${name} to cart`}
                            >
                                <img src={assets.add_icon_green} alt="" aria-hidden="true" />
                            </button>
                        </div>
                    )
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <h3 id={`food-item-${id}-name`}>{name}</h3>
                    <img src={assets.rating_starts} alt="5 star rating" />
                </div>
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price" aria-label={`Price: ${price} dollars`}>${price}</p>
        </article>
    )
}

export default FoodItem