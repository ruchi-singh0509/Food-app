import React, { useState, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Login from './components/Login/Login'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home/Home'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder/PlaceOrder'))
const Cart = lazy(() => import('./pages/Cart/Cart'))
const Verify = lazy(() => import('./pages/Verify/Verify'))
const MyOrders = lazy(() => import('./pages/MyOrders/MyOrders'))

// Loading component for Suspense fallback
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem'
  }}>
    Loading...
  </div>
)

const App = () => {
  const [login, setLogin] = useState(false)
  return (
    <>
      {login ? <Login setLogin={setLogin} /> : <></>}
      <div className='app'>
        <Navbar setLogin={setLogin} />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/myorders' element={<MyOrders/>}/>
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>

  )
}

export default App