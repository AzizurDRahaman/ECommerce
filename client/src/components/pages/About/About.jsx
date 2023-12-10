/* eslint-disable no-unused-vars */
import React from 'react'
import ScrollingText from '../../Marquee/ScrollingText'
import styles from './About.module.css';
import a6 from "../../../assets/img/about/a6.jpg";
import Feature from '../Home/Feature';

export default function About() {
  return (
    <>
        <section id="page-header" className={styles["about-header"]}>
          <h2>#knowus</h2>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </section>

    <section id={styles["about-header"]} className="section-p1">
        <img src={a6} alt=""/>
        <div>
            <h2>Who We Are?</h2>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut ab maxime, corrupti cumque, velit aliquid molestias quos laborum ullam architecto libero, nulla veritatis adipisci temporibus eveniet similique vitae impedit et perspiciatis ut reiciendis hic ex. Vel magni quasi laudantium id. Tempore aperiam a, vero voluptatem quam corporis quia neque adipisci molestiae molestias quos, accusamus quidem? Molestias, eaque culpa explicabo officia maiores quod suscipit, nobis aperiam debitis dignissimos obcaecati hic mollitia?

            </p>
            <abbr title="">Create stunning images with as mush or as little control as yau like thanks ta a chaice of Basis and Creative modes</abbr>
            <br/>
            <br/>
            <ScrollingText/>
        </div>        
    </section>
            <Feature/>
    </>
  )
}
