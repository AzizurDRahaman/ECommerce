/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../Card/Card";
import Pagination from "../../Pagination/Pagination";
import styles from "./ShowProducts.module.css";

export default function ShowProducts() {
  const [showProductsError, setShowProductsError] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const handleShowProducts = async () => {
      try {
        setShowProductsError(false);
        const res = await fetch(`/api/user/products/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setShowProductsError(true);
          return;
        }
        setUserProducts(data);
      } catch (error) {
        setShowProductsError(true);
      }
    };

    handleShowProducts(); // Initiating the fetch operation within useEffect

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser._id]);

  const removeProduct = (productId) => {
    setUserProducts(userProducts.filter(product => product._id !== productId));
  };

  return (
    <>
      <section id="page-header" className={styles["shop-header"]}>
        <h2>#fashionkaboss</h2>
        <p>Save more with coupons & up to 70% off!</p>
      </section>
      <section id={styles["product1"]} className="section-p1">
        <div className={styles["pro-container"]}>
          {userProducts.map((product, index) => (
            <Card key={index} props={product} removeProduct={removeProduct} />
          ))}
        </div>
      </section>
      <Pagination />
    </>
  );
}
