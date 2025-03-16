import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app' id='app'>
        <p>Download our <br />Tomato App</p>
        <div className="app-platform">
            <img src={assets.play_store} alt="" /><img src={assets.app_store} alt="" />
        </div>
    </div>
  )
}

export default AppDownload