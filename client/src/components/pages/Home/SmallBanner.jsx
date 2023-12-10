/* eslint-disable no-unused-vars */
import React from 'react'
import styles from './Smallbanner.module.css';

export default function SmallBanner() {
  return (
    <div>
      <section id={styles["sm-banner"]} className="section-p1">
        <div className={styles["banner-box"]}>
            <h4>Crazy Deals</h4>
            <h2>Buy 1 Get 1 Free</h2>
            <span>The best classic dress is on sale at Cara</span>
            <button className="white">Learn More</button>
        </div>
        <div className={`${styles["banner-box"]} ${styles["banner-box2"]}`}>
            <h4>Spring/Summer</h4>
            <h2>Upcoming Seasons</h2>
            <span>The best classic dress is on sale at Cara</span>
            <button className="white">Learn More</button>
        </div>
        
    </section>
    </div>
  )
}
