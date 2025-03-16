import React, { useContext, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"


const Login = ({ setLogin }) => {
    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""

    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))

    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login"
        }
        else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setLogin(false)

        }
        else {
            alert(response.data.message)
        }



    }



    return (
        <div className='login'>
            <form onSubmit={onLogin} className="login-container">
                <div className="login-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-inputs">
                    {currState === 'Login' ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter Your Name' required />}

                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter Your Email id" required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currState === 'Sign Up' ? 'Create account' : 'Login'}</button>
                <div className="login-condition">
                    <input type="checkbox" readOnly />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === 'Login' ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')} >Click here</span></p> : <p>Already have an account? <span onClick={() => setCurrState('Login')} >Login here</span></p>}


            </form>
        </div>
    )
}

export default Login