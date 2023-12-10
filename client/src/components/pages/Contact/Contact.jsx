/* eslint-disable no-unused-vars */
import React from "react";
import people1 from "../../../assets/img/people/1.png";
import people2 from "../../../assets/img/people/2.png";
import people3 from "../../../assets/img/people/3.png";
import styles from './Contact.module.css';
import { FaPhone, FaRegEnvelope, FaRegMap } from 'react-icons/fa6';
import { FaRegClock } from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <section id="page-header" className={styles["contact-header"]}>
        <h2>#let&apos;s_talk</h2>
        <p>LEAVE A MESSAGE. We love to hear from you!</p>
      </section>

      <section id={styles["contact-details"]} className="section-p1">
        <div className={styles["details"]}>
          <span>GET IN TOUCH</span>
          <h2>Visit one of our agency locations or contact us today</h2>
          <h3>Head Office</h3>
          <div>
            <li>
              <FaRegMap className={styles["icons"]} />
              <p>56 Glassford Street Glasgow G1 1UL New York</p>
            </li>

            <li>
              <FaRegEnvelope className={styles["icons"]} />
              <p>contact@example.com</p>
            </li>

            <li>
              < FaPhone className={styles["icons"]} />
              <p>+1-9876-543-210</p>
            </li>

            <li>
              <FaRegClock className={styles["icons"]}/>
              <p>Monday to Saturday 9.00 AM to 4.00 PM</p>
            </li>
          </div>
        </div>

        <div className={styles["map"]}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14664.677282874874!2d87.86479505000001!3d23.2369248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f849df1435fa6b%3A0x8d2c0458f879895a!2sBurdwan%20Medical%20College%20And%20Hospital!5e0!3m2!1sen!2sin!4v1665629613184!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section id={styles["form-details"]}>
        <form action="">
          <span>LEAVE A MESSAGE</span>
          <h2>We love to hear from you</h2>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <input type="text" placeholder="Subject" />
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Your Message"
          ></textarea>
          <button type="submit" className="normal">
            Submit
          </button>
        </form>
        <div className={styles["people"]}>
          <div>
            <img src={people1} alt="" />
            <p>
              <span>John Doe</span>Senior Marketing <br />
              Phone : +000 123 000 77 88 <br />
              Email : contact@example.com
            </p>
          </div>
          <div>
            <img src={people2} alt="" />
            <p>
              <span>William Smith</span>Senior Marketing <br />
              Phone : +000 123 000 77 88 <br />
              Email : contact@example.com
            </p>
          </div>
          <div>
            <img src={people3} alt="" />
            <p>
              <span>Emma Stone</span>Senior Marketing <br />
              Phone : +000 123 000 77 88 <br />
              Email : contact@example.com
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
