/* eslint-disable no-unused-vars */
import React from 'react'
import styles from "./Hero.module.css";
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const navigateHandle = () =>{
    navigate('/shop');
  }
  return (
    <div>
      <section id={styles["hero"]}>
        <h4>Trade-in-offer</h4>
        <h2>Super value deals</h2>
        <h1>On all products</h1>
        <p>Save more with coupons & up to 70% off!</p>
        <button onClick={navigateHandle} >Shop Now</button>
      </section>
    </div>
  )
}
