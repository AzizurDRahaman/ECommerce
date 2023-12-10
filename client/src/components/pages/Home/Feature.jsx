/* eslint-disable no-unused-vars */
import React from 'react'
import styles from './Feature.module.css';
import f1 from "../../../assets/img/features/f1.png"
import f2 from "../../../assets/img/features/f2.png"
import f3 from "../../../assets/img/features/f3.png"
import f4 from "../../../assets/img/features/f4.png"
import f5 from "../../../assets/img/features/f5.png"
import f6 from "../../../assets/img/features/f6.png"

export default function Feature() {
  return (
    <section id={styles["feature"]} className="section-p1">
        <div className={styles["fe-box"]}>
            <img src={f1} alt="Features 1"/>
            <h6>Free Shipping</h6>
        </div>
        <div className={styles["fe-box"]}>
            <img src={f2} alt="Features 2"/>
            <h6>Online Order</h6>
        </div>
        <div className={styles["fe-box"]}>
            <img src={f3} alt="Features 3"/>
            <h6>Save Money</h6>
        </div>
        <div className={styles["fe-box"]}>
            <img src={f4} alt="Features 4"/>
            <h6>Promotions</h6>
        </div>
        <div className={styles["fe-box"]}>
            <img src={f5} alt="Features 5"/>
            <h6>Happy Sell</h6>
        </div>
        <div className={styles["fe-box"]}>
            <img src={f6} alt="Features 6"/>
            <h6>F24/7 Support</h6>
        </div>
    </section>
  )
}
