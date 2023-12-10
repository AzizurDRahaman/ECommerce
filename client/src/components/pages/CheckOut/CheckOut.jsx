/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import styles from "./CheckOut.module.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import { removeCart, updateUserFailure, updateUserStart, updateUserSuccess } from "../../../redux/userSlice";

export default function CheckOut() {
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showShipping, setShowShipping] = useState(true);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [total, setTotal] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setsuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      phoneNo: "",
    },
    orderItems: [],
    userId: currentUser._id, // You might need to fill this with the user's ID
    paymentstatus: "", // You might need to fill this with payment status
    paidAt: null, // You might need to initialize this based on your logic
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    deliveredAt: null,
    createdAt: new Date(),
  });
  const cartItems = currentUser.cart;
  const fetchProduct = async (productId) => {
    const res = await fetch(`/api/product/get/${productId}`);
    const data = await res.json();
    return data;
  };

  const calculateSubtotals = async () => {
    let newSubtotals = 0;
    const products = [];
    const updatedOrderItems = [];

    for (let i = 0; i < cartItems.length; i++) {
      const productData = await fetchProduct(cartItems[i].productId);
      products.push(productData);

      const price = productData.offer
        ? productData.discountPrice
        : productData.regularPrice;
      const productId = cartItems[i].productId;
      
      const arr = {
        price,
        productId,
        quantity: cartItems[i].quantity,
        orderStatus: "Processing",
      };
      
      updatedOrderItems.push(arr);

      newSubtotals += price * cartItems[i].quantity;
    }
    setTotal(newSubtotals);
    setCartProducts(products);
    setFormData((prevFormData) => ({
      ...prevFormData,
      orderItems: updatedOrderItems, // Update formData with the modified orderItems
      itemsPrice: newSubtotals,
      totalPrice: newSubtotals,
    }));
  };

  useEffect(() => {
    calculateSubtotals();
  }, []);

  const handleInputChange = (event) => {
    let value = event.target.value;
    value = value
      .replace(/[^\dA-Z]/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCardNumber(value);
  };
  const handleMonthChange = (event) => {
    const value = event.target.value;
    if (value.length <= 2) {
      setMonth(value);
    }
  };
  const handleYearChange = (event) => {
    const value = event.target.value;
    if (value.length <= 2) {
      setYear(value);
    }
  };

  const handleChange = (event) => {
    setError(null);
    if (
      event.target.id === "address" ||
      event.target.id === "city" ||
      event.target.id === "state" ||
      event.target.id === "pinCode" ||
      event.target.id === "phoneNo"
    ) {
      setFormData({
        ...formData,
        shippingInfo: {
          ...formData.shippingInfo,
          [event.target.id]: event.target.value,
        },
      });
    }
  };

  const handleAddressSubmit = () => {
    if (!formData.shippingInfo.address) {
      setError("Address is required");
      return;
    }
    if (!formData.shippingInfo.city) {
      setError("City is required");
      return;
    }
    if (!formData.shippingInfo.state) {
      setError("State is required");
      return;
    }
    if (!formData.shippingInfo.pinCode) {
      setError("Pin Code is required");
      return;
    }
    if (!formData.shippingInfo.phoneNo) {
      setError("Phone Number is required");
      return;
    }
    setShowShipping(!showShipping);
    setShowCardDetails(!showCardDetails);
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/order/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      dispatch(removeCart())
      dispatch(updateUserStart())
      const userRes=await fetch(`/api/user/get/${currentUser._id}`);
      const userData=await userRes.json();
      if(userData.success==false){
        console.log(userData.message);
        dispatch(updateUserFailure(data.message));
        return;
      }
      setShowModal(true);
      dispatch(updateUserSuccess(userData));
      // show the modal saying order placed successful and navigate to /
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error.message));
      setError(error.message);
    }
  };

  const handlePayment = async () => {
    // Wait for 5 seconds using setTimeout
    setLoading(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000); // Wait for 5000 milliseconds (5 seconds)
    });

    // After 5 seconds, update paymentStatus and paidAt
    const currentTime = new Date(); // Get the current time

    setFormData({
      ...formData,
      paymentstatus: "paid",
      paidAt: currentTime,
    });
    setLoading(false);
    setsuccess(true);
  };

  const modal =()=>{
    setShowModal(false);
    navigate("/");
  }

  return (
    <>
      <form
        id={styles["checkout-form"]}
        className="section-p1 section-m1"
        onSubmit={submitOrder}
        ref={formRef}
      >
        <div className={styles["form"]}>
          <section>
            <div className={styles["header"]}>
              <h4>Shipping Address</h4>
              <button
                className={showShipping ? styles["rotate"] : ""}
                type="button"
                onClick={() => setShowShipping(!showShipping)}
              >
                <IoMdArrowDropdown />
              </button>
            </div>

            <div
              className={`${styles["body"]} ${
                showShipping ? "" : styles["hide"]
              }`}
            >
              <div>
                <span>Adress:</span>
                <input
                  type="text"
                  placeholder="Address"
                  id="address"
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>City:</span>
                <input
                  type="text"
                  placeholder="City"
                  id="city"
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>State:</span>
                <input
                  type="text"
                  placeholder="State"
                  id="state"
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>Pin Code:</span>
                <input
                  type="number"
                  placeholder="Pin Code"
                  id="pinCode"
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>Phone Number:</span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  id="phoneNo"
                  onChange={handleChange}
                />
              </div>
              <div>
                <button type="button" onClick={handleAddressSubmit}>
                  Next
                </button>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </section>
          <section>
            <div className={styles["header"]}>
              <h4>Card Details</h4>
              <button
                className={showCardDetails ? styles["rotate"] : ""}
                type="button"
                onClick={() => setShowCardDetails(!showCardDetails)}
              >
                <IoMdArrowDropdown />
              </button>
            </div>

            <div
              className={`${styles["body"]} ${
                showCardDetails ? "" : styles["hide"]
              }`}
            >
              <div>
                <span>Card Details:</span>
                <input
                  type="tel"
                  value={cardNumber}
                  onChange={handleInputChange}
                  maxLength={19}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              <div className={styles["exc"]} >

              <div>
                <span>Expiry Date:</span>
                <div className={styles["expiry"]}>
                  <input
                    type="number"
                    max={12}
                    maxLength={2}
                    min={1}
                    placeholder="MM"
                    onChange={handleMonthChange}
                    value={month}
                    />{" "}
                  /
                  <input
                    type="number"
                    max={50}
                    maxLength={2}
                    min={24}
                    placeholder="YY"
                    value={year}
                    onChange={handleYearChange}
                  />
                </div>
              </div>
              <div className={styles["cvv"]}>
                <span>CVV:</span>
                <input type="password" maxLength={3} placeholder="CVV" />
              </div>
                </div>
              <div>
                <span>Card Holder&apos;s Name:</span>
                <input type="text" placeholder="Name" />
              </div>

              <div>
                <button type="button" onClick={handlePayment}>
                  {" "}
                  {loading ? "Connecting to Payment gateway" : "Pay"}{" "}
                </button>
              </div>
              {success && (
                <p style={{ color: "green" }}> Payment Succcessful </p>
              )}
            </div>
          </section>
        </div>

        {currentUser.cart.length>0 &&<div id={styles["subtotal"]}>
          <h3>Items</h3>
          <table className={styles["items"]}>
            <thead>
              <tr>
                <td>Product</td>
                <td>Quantity</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product, index) => {
                return (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{cartItems[index].quantity}</td>
                    <td>
                      ₹
                      {cartItems[index].quantity *
                        (product.offer
                          ? product.discountPrice
                          : product.regularPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3>Cart Totals</h3>
          <table>
            <tbody>
              <tr>
                <td>Cart Subtotal</td>
                <td>₹{total}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>₹{total}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" className="normal">
            Place Your Order
          </button>
        </div>}
      </form>
      <Modal showModal={showModal} handleClose={modal}>
      <h1>Order Successful</h1>
      <p>Your order has been placed successfully!</p>
</Modal>


    </>
  );
}
