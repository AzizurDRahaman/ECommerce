/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Profile.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../../../redux/userSlice.js";

export default function SignUp() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    enteredPassword: "",
    confirmedPassword: "",
    role: currentUser.role,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  return (
    <>
      <section id={styles["form-details"]}>
        <form onSubmit={handleSubmit}>
          <h2>{currentUser.name}</h2>
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter Password"
            id="enteredPassword"
            value={formData.enteredPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmedPassword"
            value={formData.confirmedPassword}
            onChange={handleChange}
          />
          <select
            id="role"
            defaultValue={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
          <div>
            <button type="submit" className="normal">
              Update
            </button>
          </div>
          <div className={styles["options"]}>
            <Link onClick={handleDeleteUser}>Delete Account</Link>
          </div>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!error && updateSuccess && (
          <p style={{ color: "green" }}>User Updated Succesfully</p>
        )}
      </section>
    </>
  );
}
