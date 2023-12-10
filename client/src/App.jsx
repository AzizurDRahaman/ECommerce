/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { Shop } from "./components/pages/Shop/Shop";
import About from "./components/pages/About/About";
import Contact from "./components/pages/Contact/Contact";
import SignIn from "./components/pages/SignIn/SignIn";
import Cart from "./components/pages/Cart/Cart";
import ProductDetails from "./components/pages/ProductDetails/ProductDetails";
import SignUp from "./components/pages/SignIn/SignUp";
import Profile from "./components/pages/Profile/Profile";
import UpdateProfile from "./components/pages/Profile/UpdateProfile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import CreateProduct from "./components/pages/ProductDetails/CreateProduct";
import UpdateProduct from "./components/pages/ProductDetails/UpdateProduct";
import ShowProducts from "./components/pages/Profile/ShowProducts";
import CheckOut from "./components/pages/CheckOut/CheckOut";
import ViewOrder from "./components/pages/Orders/ViewOrder";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-products" element={<ShowProducts />} />
          <Route path="/my-orders" element={<ViewOrder />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/update-product/:productId" element={<UpdateProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/check-out" element={<CheckOut />} />
        </Route>
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
