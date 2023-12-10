/* eslint-disable no-unused-vars */
import React from 'react'
import styles from "./LongBanner.module.css";

export default function LongBanner() {
  return (
    <div>
      <section id={styles["banner"]} className="section-m1">
        <h4>Repair Services</h4>
        <h2>Up to <span>70% off</span> - All t-shirts and Accessories</h2>
        <button className="normal">Explore More</button>
    </section>
    </div>
  )
}
