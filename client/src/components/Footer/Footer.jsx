import { FaFacebook, FaInstagram, FaPinterest, FaTwitter, FaYoutube } from 'react-icons/fa'
import styles from './Footer.module.css';
import { useLocation } from "react-router-dom";

import app from '../../assets/img/pay/app.jpg'
import play from '../../assets/img/pay/play.jpg'
import pay from '../../assets/img/pay/pay.png'

export default function Footer() {
    const location = useLocation();
    const shouldRenderNewsletter = (location.pathname !== "/sign-in" && location.pathname !=="/sign-up" );
  return (
    <>
      {shouldRenderNewsletter &&
        <section id={styles["newsletter"]} className="section-p1 section-m1">
        <div className={styles["newstext"]}>
            <h4>Sign Up For Newsletter</h4>
            <p>GetE-mail updates about our latest shop and <span>special offers</span>.</p>
        </div>
        <div className={styles["form"]}>
            <input type="email" placeholder="Your Email Id"/>
            <button className="normal">Sign Up</button>
        </div>
    </section>}

    <section id={styles["footer"]} className="section-p1">
        
        <div className={styles["col"]}>
            <img className={styles["logo"]} src="img/logo.png" alt=""/>
            <h4>Contact</h4>
            <p><strong>Address: </strong>562 Wellington Road,Street 32,San Francisco</p>
            <p><strong>Phone: </strong>+01 2222 365 /(+91) 01 2345 6789</p>
            <p><strong>Hours: </strong>10:00 - 18:00,Mon-Sat</p>
            <div className={styles["follow"]}>
                <h4>Follow Us</h4>
                <div className={styles["icon"]}>
                    <FaFacebook/>
                    <FaTwitter/>
                    <FaInstagram/>
                    <FaPinterest/>
                    <FaYoutube/>
                </div>
            </div>
        </div>
        
        <div className={styles["col"]}>
            <h4>About</h4>
            <a href="#">About us</a>
            <a href="#">Delivery Information</a> 
            <a href="#">Privacy Policy</a> 
            <a href="#">Terms&Conditions</a> 
            <a href="#">Contact Us</a> 
        </div>

        <div className={styles["col"]}>
            <h4>My Account</h4>
            <a href="#">Sign In</a>
            <a href="#">View Cart</a> 
            <a href="#">My Wishlist</a> 
            <a href="#">Track My Order</a> 
            <a href="#">Help</a> 
        </div>

        <div className={`${styles["col"]} ${styles["install"]}`}>
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className={styles["row"]}>
                <img src={app} alt=""/>
                <img src={play} alt=""/>
            </div>
            <p>Secured Payment Gateways</p>
            <img src={pay} alt=""/>
        </div>

        
    </section>
    <footer>
        <div className={styles["copyright"]}>
            <p>©️ 2023 Azizur Rahaman</p>
        </div>
    </footer>)
    </>
  )
}
