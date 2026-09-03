import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, } from 'react-toastify';
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
import MetaData from './Components/Layout/MetaData'
import ProductDetails from './Components/Product/ProductDetails'
import Register from './Components/User/Register'
import Login from './Components/User/Login'
import NewPassword from './Components/User/NewPassword';
import ForgotPassword from './Components/User/ForgotPassword';
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateProfile';
import UpdatePassword from './Components/User/UpdatePassword';

function App() {

  return (
    <>
      
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/product/:id" element={<ProductDetails />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register exact="true" />} />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          <Route path="/password/reset/:token" element={<NewPassword />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/password/update" element={<UpdatePassword />} />
        </Routes>
      </Router>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
