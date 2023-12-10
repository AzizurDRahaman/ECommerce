/* eslint-disable no-unused-vars */
import React from "react";
import styles from "./Profile.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../../../redux/userSlice.js";

export default function SignUp() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/update-profile");
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const navigateToCreateProduct = ()=>{
    navigate("/create-product")
  }
  return (
    <>
      <section id={styles["form-details"]}>
        <form action="">
          <h2>{currentUser.name}</h2>
          <input
            type="text"
            placeholder="Name"
            value={currentUser.name}
            readOnly
          />
          <input
            type="email"
            placeholder="Email"
            value={currentUser.email}
            readOnly
          />
          <input type="text" value={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} readOnly />
          <div style={{display:"flex", flexDirection:"column", gap:10}} >
            <button type="button" className="normal" onClick={handleClick}>
              Edit
            </button>
            {currentUser.role === "seller" && (
              <button type="button" className="normal" onClick={navigateToCreateProduct} >
                Add a product
              </button>
            )}
          </div>
          <div className={styles["options"]}>
            <Link onClick={handleSignOut}>Sign Out</Link>
          </div>
        </form>
      </section>
      <section id={styles["order"]}>
        <Link to="/my-orders">
        {currentUser.role === "user"
          && "View Your Orders"}
          </Link>
        <Link to="/my-products">
          {currentUser.role === "seller" && "View Your Products"}
          </Link>
      </section>
    </>
  );
}
