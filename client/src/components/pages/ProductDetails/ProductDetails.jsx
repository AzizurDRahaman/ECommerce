/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../../redux/userSlice.js";
import styles from "./ProductDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../Card/Card";

export default function ProductDetails() {
  const params = useParams();
  const productId = params.productId;
  const { currentUser } = useSelector((state) => state.user);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [totalRating, setTotalRating] = useState(0);
  const [reviewError, setReviewError] = useState(null);
  const [comment, setComment] = useState('');
  // const [userRating, setUserRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    productId,
  });
  const [reviews, setReviews] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/get?limit=4`);
        const data = await res.json();
        const { products, totalCount } = data;
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    imageUrls: [],
    description: "",
    regularPrice: "",
    discountPrice: "",
    clotheType: "",
    offer: false,
    type: "",
    quantity: "",
    ratings: 0,
    reviews: [],
  });
  const [mainImage, setMainImage] = useState();
  const [cartItem, setCartItem] = useState({
    productId,
    quantity: 1,
  });
  // console.log(cartItem);

  let hasReview = false;
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].user === currentUser._id) {
      hasReview = true;
    }
  }
  const [isEditing, setIsEditing] = useState(!hasReview);

  const handleRating = (rate) => {
    setReviewData({
      ...reviewData,
      rating: rate,
    });
    // other logic
  };

  const handleChange = (event) => {
    setReviewError(null);
    setComment(event.target.value);
    setReviewData({
      ...reviewData,
      comment: event.target.value,
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/product/get/${productId}`);
      const data = await res.json();
      setMainImage(data.imageUrls[0]);
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setReviews(data.reviews);
      let ratings = data.ratings;
      let decimalPart = ratings - Math.floor(ratings);

      if (decimalPart > 0 && decimalPart <= 0.5) {
        ratings = Math.floor(ratings) + 0.5;
      } else {
        ratings = Math.round(ratings);
      }

      setTotalRating(ratings);
      setFormData(data);
    };
    fetchProduct();
  }, [productId, refreshKey]);
  const navigate = useNavigate();
  const handleProductDelete = async () => {
    try {
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/my-products");
      }, 2000);
      // Product has been deleted, perform any necessary actions (e.g., redirect)
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/update-product/${productId}`);
  };

  const handleImageClick = (index) => {
    setMainImage(formData.imageUrls[index]);
  };

  const handleCartChange = (event) => {
    if (event.target.id === "quantity") {
      setCartItem((prevCartItem) => ({
        ...prevCartItem,
        [event.target.id]: +event.target.value,
      }));
    }
  };

  const handleAddCart = async () => {
    if (cartItem.quantity > formData.quantity) {
      setError("Requested Quantity is More than that in stock");
      return;
    }

    const productIdToAdd = cartItem.productId;

    const isProductInCart = () => {
      const arr = currentUser.cart;
      var i;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].productId === productIdToAdd) {
          return true;
        }
      }
      return false;
    };
    const boolean = isProductInCart();

    try {
      dispatch(updateUserStart());
      setError(null);
      if (boolean) {
        dispatch(updateUserFailure("Product is already in the cart"));
        setError("Product is already in the cart");
        return;
      }
      const updatedUser = {
        ...currentUser,
        cart: [...currentUser.cart, cartItem], // Create a new cart array including the new cartItem
      };
      console.log(updatedUser);

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setError(error.message);
    }
  };

  const transformReviewData = (reviewData) => {
    // Transform reviewData to match the schema of your reviews
    // This is just a placeholder. Replace it with actual transformation logic
    const transformedData = {
      ...reviewData,
      name: currentUser.name,
      // Add or modify fields as necessary
    };
    return transformedData;
  };
  console.log(totalRating);

  const addReviewHandler = async (event) => {
    setIsEditing(false);
    event.preventDefault();
    try {
      if (reviewData.rating === 0) {
        setReviewError("Rating cannot be zero");
        return;
      }
      if (reviewData.comment === "") {
        setReviewError("Pleae leave a comment");
        return;
      }
      const res = await fetch("/api/product/review", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success) {
        // Transform reviewData to match the schema of your reviews
        const newReview = transformReviewData(reviewData);
        // Add the transformed reviewData to reviews
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      setReviewError("Hello " + error.message);
      setIsEditing(true);
    }
  };

  const isQuantityZero = formData.quantity === 0;
  return (
    <>
      <section id={styles["prodetails"]} className="section-p1">
        <div className={styles["single-pro-image"]}>
          <img
            src={mainImage}
            width="100%"
            id="MainImg"
            alt=""
            style={{ filter: isQuantityZero ? "grayscale(100%)" : "none" }}
          />
          <div className={styles["small-img-group"]}>
            {formData.imageUrls.slice(0, 4).map((imageUrl, index) => (
              <div
                key={index}
                className={styles["small-img-col"]}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={imageUrl}
                  width="100%"
                  className={styles["small-img"]}
                  alt={`Product ${index + 1}`}
                  style={{
                    filter: isQuantityZero ? "grayscale(100%)" : "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles["single-pro-details"]}>
          <h6>
            {formData.clotheType} / {formData.type}
          </h6>
          <h4>{formData.name}</h4>
          <h2 className={formData.offer ? `${styles["strike"]}` : ""}>
            ₹{formData.regularPrice}
          </h2>
          {formData.offer && <h2>₹{formData.discountPrice}</h2>}
          {(!currentUser || currentUser._id !== formData.userRef) && (
            <input
              type="number"
              value={cartItem.quantity}
              id="quantity"
              onChange={handleCartChange}
            />
          )}
          {(!currentUser || currentUser._id !== formData.userRef) && (
            <button className="normal" onClick={handleAddCart}>
              Add To Cart
            </button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {currentUser && currentUser._id === formData.userRef && (
            <button className="normal" onClick={handleEdit}>
              Edit
            </button>
          )}
          {currentUser && currentUser._id === formData.userRef && (
            <button
              className={`normal ${styles["delete-button"]}`}
              onClick={handleProductDelete}
            >
              {" "}
              Delete{" "}
            </button>
          )}
          <div className={styles["star"]}>
            <Rating initialValue={totalRating} allowFraction readonly />
          </div>

          {showSuccessMessage && (
            <div className={styles["success-message"]}>
              Product has been deleted successfully!
            </div>
          )}
          {formData.quantity <= 10 && formData.quantity > 0 && (
            <p>
              {(!currentUser || currentUser._id !== formData.userRef) &&
                "Hurry Up!  "}
              Only {formData.quantity} pieces left in stock
            </p>
          )}
          {formData.quantity == 0 && <p>Out of stock</p>}
          <h4>Product Details</h4>
          <span>{formData.description}</span>
        </div>
      </section>

      {(!currentUser || currentUser._id !== formData.userRef) && (
        <section id={styles["product1"]} className="section-p1">
          <h2>Featured Products</h2>
          <p>Summer Collection New Modern Design</p>
          <div className={styles["pro-container"]}>
            {products.map((product) => {
              return <Card key={product._id} props={product} />;
            })}
          </div>
        </section>
      )}

      {
        <div id={styles["product1"]} className="section-p1">
          <h2>Product Reviews</h2>
          {currentUser && !hasReview && (
            <div className={styles["review-input"]}>
              <h3>{currentUser.name}</h3>
              <div className={styles["star"]}>
                <Rating size={20} allowFraction onClick={handleRating} />
              </div>

              <textarea placeholder="Add a Review" onChange={handleChange} />
              <button className="normal" onClick={addReviewHandler}>
                Add Review
              </button>
            </div>
          )}
          {reviewError && <p>{reviewError}</p>}
          <div className={styles["reviews-container"]}>
            {reviews.map((review, index) => {
              return (
                review.user === currentUser._id && (
                  <div id={styles["review"]} key={index}>
                    <h3>{review.name}</h3>
                    <div className={styles["star"]}>
                      <Rating
                        initialValue={review.rating}
                        allowFraction
                        readonly={!isEditing}
                        size={20}
                        onClick={handleRating}
                      />
                      {!isEditing && (
                        <button
                          className="normal"
                          onClick={() => {
                            setIsEditing(true);
                            setComment(review.comment); // set comment to the current review's comment
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <textarea
                      readOnly={!isEditing}
                      value={isEditing ? comment : review.comment}
                      onChange={handleChange}
                    />
                    {isEditing && (
                      <button className="normal" onClick={addReviewHandler}>
                        Add Review
                      </button>
                    )}
                  </div>
                )
              );
            })}
            {reviews.map((review, index) => {
              return (
                review.user !== currentUser._id && (
                  <div id={styles["review"]} key={index}>
                    <h3>{review.name}</h3>
                    <div className={styles["star"]}>
                      <Rating
                        initialValue={review.rating}
                        allowFraction
                        size={20}
                        readonly
                      />
                    </div>
                    <textarea readOnly value={review.comment} />
                  </div>
                )
              );
            })}
          </div>
        </div>
      }
    </>
  );
}
