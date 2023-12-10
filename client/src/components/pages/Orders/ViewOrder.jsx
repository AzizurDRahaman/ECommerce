/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from "./Order.module.css";
import { useSelector } from "react-redux";
import emptyBox from "../../../assets/img/empty-box.png"
import { useNavigate } from "react-router-dom";

export default function ViewOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const [userOrders, setUserOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async() => {
      if (currentUser.role === "user") {
        const order=[];
        try {
          const res=await fetch("/api/order/get/my-orders");
          const data= await res.json();
          // console.log(data);
          // console.log(data.orders);
          // const temp=[];
          for(var i=0;i<data.orders.length;i++){
            const tempOrderItem=data.orders[i].orderItems;
            for(var j=0;j<tempOrderItem.length;j++){
              order.push(tempOrderItem[j]);
            }
          }
          console.log(order);

          const products=[];
          for(var k=0;k<order.length;k++){
            const productId=order[k].productId;
            const res=await fetch(`/api/product/get/${productId}`);
            const { name, imageUrls, ...rest } = await res.json();
            const product = {
              productName: name,
              image: imageUrls[0],
              price:order[k].price,
              quantity:order[k].quantity,
              subTotal:order[k].price * order[k].quantity,
              orderStatus:order[k].orderStatus
            };
            products.push(product);
          }
          console.log(products);
          setUserOrders(products);

        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchOrders();
  }, []);
  // console.log(userOrders);
  const navigate = useNavigate();
  const navigateHandler =()=>{
    navigate("/shop");
}
  return (
    <div>
      {currentUser.order.length===0 &&
        <section id="empty" >
            <img src={emptyBox} />
            <div>
                <h2>You Have Not Ordered Anything Yet</h2>
                <p>Order items to view them</p>
            </div>
            <button className='normal' type='button' onClick={navigateHandler} >Go To Shop</button>
        </section>
     }
      {currentUser.order.length > 0 && (
        <section id={styles["order"]} className="section-p1">
          <table width="100%">
            <thead>
              <tr>
                <td>Image</td>
                <td>Product</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>Subtotal</td>
                <td>Order Status</td>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((product, index) =>(
                  <tr key={index}>
                    <td>
                      <img src={product.image} alt="image" />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.subTotal}</td>
                    <td>{product.orderStatus}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
