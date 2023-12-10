/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import styles from './Cart.module.css';
import { useSelector } from 'react-redux';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import emptyCart from "../../../assets/img/empty-cart.png"

export default function Cart() {
    const { currentUser } = useSelector((state) => state.user);
    const [subtotals, setSubtotals] = useState(0);
    const cartItems=currentUser.cart;
    const navigate = useNavigate();
    useEffect(()=>{
        let i=0;
        const fetchProduct= async(productId)=>{
            const res = await fetch(`/api/product/get/${productId}`);
            const data = await res.json();
            return data.offer ? data.discountPrice : data.regularPrice;
        }
        const calculateSubtotals = async () => {
            let newSubtotals = 0;
            for (let i = 0; i < cartItems.length; i++) {
                const price = await fetchProduct(cartItems[i].productId);
                console.log(price);
                newSubtotals += price * cartItems[i].quantity;
            }
            setSubtotals(newSubtotals);
        }
        calculateSubtotals();
    },[cartItems])

    const checkOut=()=>{
        navigate('/check-out');
    }

    const navigateHandler =()=>{
        navigate("/shop");
    }
    
  return (
    <div>

    {currentUser.cart.length===0 &&
        <section id="empty" >
            <img src={emptyCart} />
            <div>
                <h2>You Have No Items In Your Cart</h2>
                <p>Add Items to Your Cart To View them</p>
            </div>
            <button className='normal' type='button' onClick={navigateHandler} >Go To Shop</button>
        </section>
     }

    { currentUser.cart.length>0 && <section id={styles["cart"]} className="section-p1">
        <table width="100%">
            <thead>
                <tr>
                    <td>Image</td>
                    <td>Product</td>
                    <td>Price</td>
                    <td>Quantity</td>
                    <td>Subtotal</td>
                    <td>Remove</td>
                </tr>
            </thead>
            <tbody>
                {cartItems.map((cartItem, index)=>{
                    return(
                        <CartItem key={index} index={index} item={cartItem}  />
                    )
                })}
            </tbody>
        </table>
    </section>}

    {currentUser.cart.length>0 && <section id={styles["cart-add"]} className="section-p1">
        <div id={styles["coupon"]}>
            <h3>Apply Coupon</h3>
            <div>
                <input type="text" placeholder="Enter Your Coupon"/>
                <button className="normal">Apply</button>
            </div>
        </div>
        <div id={styles["subtotal"]}>
            <h3>Cart Totals</h3>
            <table>
                <tbody>

                <tr>
                    <td>Cart Subtotal</td>
                    <td>₹{subtotals}</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>₹{subtotals}</strong></td>
                </tr>
                </tbody>
            </table>
            <button className="normal" onClick={checkOut} >Proceed to checkout</button>
        </div>
    </section>}
    </div>
  )
}
