/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import styles from './ProductHeading.module.css';
import Card from '../../Card/Card';

export default function ProductHeading(props) {
  const type= props.type;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/get?limit=4&type=${type}`);
        const data = await res.json();
        const { products, totalCount } = data;
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <section id={styles["product1"]} className="section-p1">
        <h2>{props.heading}</h2>
        <p>{props.para}</p>
        <div className={styles["pro-container"]}>
            {products.map((product) => {
              return <Card key={product._id} props={product} />;
            })}
          </div>
        
    </section>
  )
}
