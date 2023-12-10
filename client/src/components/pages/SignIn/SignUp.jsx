/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../OAuth/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({ role: 'user' });
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;

  // Check if the event target is the select input for 'role'
  if (id === 'role') {
    // Update formData with the selected 'role' value
    setFormData({
      ...formData,
      role: value, // Assigning the selected 'role' value to the 'role' field
    });
  } else {
    // For other inputs, update formData as before
    setFormData({
      ...formData,
      [id]: value,
    });
  }
}

  const submitHandler = async(event)=>{
    event.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/sign-up',{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setSuccessMessage("User created successfully");
      setTimeout(() => {
        setSuccessMessage("Redirecting to Sign In Page");
        navigate("/sign-in");
      }, 2000);
      setError(null);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <>
      <section id={styles["form-details"]}>
        <form onSubmit={submitHandler} >
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            onChange={handleChange}
            id="name"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            id="email"
          />
          <input
            type="password"
            placeholder="Enter Password"
            onChange={handleChange}
            id="enteredPassword"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            id="confirmedPassword"
          />
          <select id="role" onChange={handleChange} defaultValue={"user"} >
            <option value="user" >User</option>
            <option value="seller" >Seller</option>
          </select>
          <div>
            <button disabled={loading} type="submit" className="normal">
              { loading ? "Connecting to server":"Create Account" }
            </button>
            <OAuth/>
          </div>
        </form>
        <p>
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
        {error && <p style={{"color":"red"}} >{ error}</p>}
        {!error && successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </section>
    </>
  );
}
