import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import SEO from '../../components/SEO/SEO'

const Home = () => {

  const [category, setCategory] = useState("All");
  return (
    <div>
      <SEO 
        title="Home - Order Delicious Food Online"
        description="Browse our menu and order delicious food online with fast delivery. Enjoy a wide variety of cuisines at great prices."
        keywords="food delivery, online food, restaurant menu, fast delivery, food app"
      />
      <Header />
      <Menu  category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
    </div>
  )
}

export default Home