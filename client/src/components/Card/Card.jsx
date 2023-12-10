/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styles from "./Card.module.css";
import { FaRegStar, FaShoppingCart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../redux/userSlice';
import { useState } from "react";

export default function Card({ props, removeProduct }) {
  const fullStars = Math.floor(props.ratings); // Extract the number of full stars
  const hasHalfStar = props.ratings - fullStars !== 0;
  const renderStars = () => {
    let stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    // Add remaining stars up to a total of 5 (considering full stars and a half star)
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);
    const remainingStars = 5 - totalStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`remaining-${i}`} />);
    }

    return stars;
  };
  const dispatch = useDispatch();
  
  const [error, setError] = useState(null);
const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleProductDelete = async (event, productId) => {
    event.stopPropagation();
    try {
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      removeProduct(productId);
      
    } catch (error) {
      console.log(error.message);
    }
  };
  const navigateHandler=(event)=>{
    event.stopPropagation();
    navigate(`/update-product/${props._id}`)
  }
  
  const navigateProductHandler =() =>{
    navigate(`/product/${props._id}`)
  }
  const isQuantityZero = props.quantity === 0;

  const handleAddCart = async (event) => {
    event.stopPropagation();
    const cartItem = props;

    const productIdToAdd = cartItem._id;

    const isProductInCart = ()=>{
      const arr=currentUser.cart
      var i;
      for(i=0; i<arr.length;i++){
        if(arr[i].productId === productIdToAdd){
          return true;
        }
      }
      return false;
    }
    const boolean=isProductInCart();
    
    try {
      dispatch(updateUserStart());
      setError(null);
      if (boolean) {
        dispatch(updateUserFailure("Product is already in the cart"))
        setError("Product is already in the cart");
        return;
      }
      const updatedUser = {
        ...currentUser,
        cart: [...currentUser.cart, {productId: cartItem._id, quantity:1}], // Create a new cart array including the new cartItem
      };

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      console.log(data);
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      setError(error.message);
    }
  };


  return (
    <div className={styles["pro"]} onClick={navigateProductHandler}>
      <img src={props.imageUrls[0]} alt="" style={{ filter: isQuantityZero ? 'grayscale(100%)' : 'none' }}/>
      <div className={styles["des"]}>
        <span>
          {props.clotheType}/{props.type}
        </span>
        <h5>{props.name}</h5>
        <div className={styles["star"]}>{renderStars()}</div>
        <div style={{display:"flex", gap:"4px"}}>
          <h4 className={props.offer ? `${styles["strike"]}` : ""} >₹{props.regularPrice}</h4>
          {props.offer && <h4>₹{props.discountPrice}</h4>}
        </div>
      </div>
        { currentUser && currentUser._id===props.userRef && <span
          className={`${styles["material-symbols-outlined"]} ${styles["cart"]}`} onClick={navigateHandler}
        >
          <MdModeEdit />
        </span>}
        { (!currentUser || currentUser._id!==props.userRef) && props.quantity>0 && <span
          className={`${styles["material-symbols-outlined"]} ${styles["cart"]}`}
          onClick={handleAddCart}
        >
          <FaShoppingCart/> 
        </span>}
        {currentUser && currentUser._id===props.userRef && <span
          className={`${styles["material-symbols-outlined"]} ${styles["delete"]}` }
          onClick={(event) => handleProductDelete(event,props._id)}
        >
          <MdDelete/>
        </span>}
    </div>
  );
}
