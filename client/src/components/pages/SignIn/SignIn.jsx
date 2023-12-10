/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';
import { signInStart, signInSuccess, signInFailure } from '../../../redux/userSlice.js';
import OAuth from '../../OAuth/OAuth.jsx';

export default function SignIn() {
  const [ successMessage, setSuccessMessage ] = useState(null);
  const[ formData, setFormData ] = useState({});

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleChange = (event) =>{
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    })
  };
  const dispatch = useDispatch();
  const submitHandler = async(event)=>{
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/sign-in',{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setSuccessMessage("Logged In Successfully");
      setTimeout(() => {
        setSuccessMessage("Redirecting to Sign In Page");
        navigate("/");
      }, 2000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <>
      <section id={styles["form-details"]}>
        <form onSubmit={ submitHandler } >
          <h2>Sign In</h2>
          <input type="email" placeholder="Email" id="email" onChange={handleChange} />
          <input type="password" placeholder="Password" id="password" onChange={handleChange} />
          <div>

          <button disabled={loading} type="submit" className="normal">
          { loading ? "Connecting to server":"Sign In"}
          </button>
          <OAuth/>
          </div>
        </form>
        <p>Don&apos;t have an account? <Link to="/sign-up" >Create An Account</Link></p>
        {error && <p style={{"color":"red"}} >{ error}</p>}
        {!error && successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </section>
    </>
  )
}
