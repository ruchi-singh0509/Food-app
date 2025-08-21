import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        if (response.data.success) {
            navigate("/myorders");

        }
        else {
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment();
    },[])


    return (
        <div className='verify'>
            <SEO 
                title="Verifying Payment - Processing Your Order"
                description="We're verifying your payment and processing your food order. Please wait a moment."
                keywords="payment verification, order processing, food delivery confirmation"
            />
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
