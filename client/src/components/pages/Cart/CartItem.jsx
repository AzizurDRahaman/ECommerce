/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart,updateUserFailure,
  updateUserStart,
  updateUserSuccess } from '../../../redux/userSlice.js';
import './Cart.css';

export default function CartItem({item, index, sendSubtotal}) {
  const [mainImage, setMainImage] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    imageUrls: [],
    description: "",
    regularPrice: "",
    discountPrice: "",
    clotheType: "",
    offer: false,
    type: "",
    quantity: "",
    ratings: 0,
    reviews: [],
  });
  const [quantity, setQuantity] = useState(item.quantity);
  const productId = item.productId;
  const [itemPrice, setItemPrice] = useState(0);
  useEffect(()=>{
    const fetchProduct = async () => {
      const res = await fetch(`/api/product/get/${productId}`);
      const data = await res.json();
      setMainImage(data.imageUrls[0]);
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      if(data.offer){
        setItemPrice(data.discountPrice);
      }
      else{
        setItemPrice(data.regularPrice);
      }
    };
    fetchProduct();
  },[item])

  const dispatch = useDispatch();

const handleRemove = () => {
  dispatch(removeFromCart(productId));
};

const addQuantity = async()=>{
  const newItem = {productId, quantity: quantity+1};
  setQuantity(quantity+1);
  try {
    dispatch(updateUserStart());

    // Create a copy of the current cart
    const updatedCart = [...currentUser.cart];

    // Remove the old item from the cart
    updatedCart.splice(index, 1);

    // Add the new item at the specific index
    updatedCart.splice(index, 0, newItem);

    const updatedUser = {
      ...currentUser,
      cart: updatedCart, // Use the updated cart
    };

    const response = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    const data = await response.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data))
  } catch (error) {
    dispatch(updateUserFailure(error.message))
  }
  }
const removeQuantity = async()=>{
    if(quantity==1){
      dispatch(removeFromCart(productId));
      return;
    }
    setQuantity(quantity-1);
    const newItem = {productId, quantity: quantity-1};

    try {
      dispatch(updateUserStart());

      // Create a copy of the current cart
      const updatedCart = [...currentUser.cart];

      // Remove the old item from the cart
      updatedCart.splice(index, 1);

      // Add the new item at the specific index
      updatedCart.splice(index, 0, newItem);

      const updatedUser = {
        ...currentUser,
        cart: updatedCart, // Use the updated cart
      };

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const subtotal = itemPrice * quantity;

  return (
    <tr>
      <td>
        <img src={mainImage} alt="" />
      </td>
      <td>{formData.name}</td>
      <td>₹{formData.offer ? formData.discountPrice : formData.regularPrice}</td>
      <td>
        <button onClick={removeQuantity} >-</button>
        <input type="number" value={quantity} readOnly/>
        <button onClick={addQuantity} >+</button>
      </td>
      <td>₹{subtotal}</td>
      <td>
        <button onClick={handleRemove} >X</button>
      </td>
    </tr>
  );
}
