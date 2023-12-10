/* eslint-disable no-unused-vars */
import React from 'react'
import styles from './BottomBanner.module.css';

export default function BottomBanner() {
  return (
    <div>
      <section id={styles["banner3"]}>
        <div className={styles["banner-box"]}>
            <h2>SEASONAL SALE</h2>
            <h3>Winter Coollection -50% off</h3>
        </div>
        <div className={`${styles["banner-box"]} ${styles["banner-box2"]}`}>
            <h2>NEW FOOTWEAR COLLECTION</h2>
            <h3>Spring/Summer 2022</h3>
        </div>
        <div className={`${styles["banner-box"]} ${styles["banner-box3"]}`}>
            <h2>T-SHIRTS</h2>
            <h3>New Trendy Prints</h3>
        </div>

    </section>
    </div>
  )
}
