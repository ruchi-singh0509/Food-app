import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import SEO from '../../components/SEO/SEO';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }

    }, [token])

    return (
        <div className='my-orders'>
            <SEO 
                title="My Orders - Track Your Food Deliveries"
                description="View and track your food orders. Check order status, delivery details, and order history."
                keywords="order tracking, food delivery status, order history, my orders"
            />
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, index) => {
                            return index === order.items.length - 1
                                ? `${item.name} x${item.quantity}`
                                : `${item.name} x${item.quantity}, `;
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default MyOrders
