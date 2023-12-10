/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from "./CreateProduct.module.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const [files, setFiles] = useState([]);
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
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
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const params = useParams();
  const productId = params.productId;
  useEffect(()=>{
    const fetchProduct = async()=>{
        const res = await fetch(`/api/product/get/${productId}`)
        const data = await res.json();
        if(data.success === false){
            console.log(data.message);
            return;
        }
        setFormData(data);
    };
    fetchProduct();
  },[productId]);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 6) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload only 5 images per product");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (event) => {
    if (
      event.target.id === "name" ||
      event.target.id === "description" ||
      event.target.id === "regularPrice" ||
      event.target.id === "discountPrice" ||
      event.target.id === "quantity" ||
      event.target.id === "clotheType" || 
      event.target.id==="type"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    }
    if(event.target.id === "offer"){
      setFormData({
        ...formData,
        [event.target.id]: event.target.checked
      })
    }

    
  };

  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      if(formData.offer === false){
        formData.discountPrice=0;
      }
      const res = await fetch(`/api/product/update/${productId}`,{
        method:"PUT",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })
      const data= await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate(`/product/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <form id={styles["product-form"]} onSubmit={handleSubmit}>
      <div id={styles["form-details"]}>
      <span>Name:</span>
        <input
          type="text"
          id="name"
          placeholder="Name of product"
          value={formData.name}
          onChange={handleChange}
        />
        <span>Product Details:</span>
        <textarea
          placeholder="Product Details"
          id="description"
          value={formData.description}
          onChange={handleChange}
        />
        <select id="clotheType" onChange={handleChange}>
          <option>Style of Clothe</option>
          <option value="Work">Work</option>
          <option value="Fashion">Fashion</option>
          <option value="Casual">Casual</option>
        </select>
        <select id="type" onChange={handleChange}>
          <option>Type of Clothe</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Shirt">Shirt</option>
          <option value="Pants">Pants</option>
        </select>
        <span>Regular Price:</span>
        <input
          type="number"
          id="regularPrice"
          placeholder="Regular Price"
          value={formData.regularPrice}
          onChange={handleChange}
        />
        <div className={styles["offer"]}>
          <span> Offer: </span> <input type="checkbox" id="offer" onChange={handleChange} checked={formData.offer} />
        </div>
        {formData.offer && <span>Discount Price:</span>}
        { formData.offer && <input
          type="number"
          placeholder="Discount Price"
          id="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
        />}
        <span>Quantity:</span>
        <input
          type="number"
          id="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
      </div>

      <div id={styles["form-details"]}>
        <p>
          Images: <span>(Upto 5 images max )</span>{" "}
        </p>

        <input
          type="file"
          id={styles["images"]}
          accept="image/*"
          multiple
          onChange={(e) => {
            setFiles(e.target.files);
          }}
        />

        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => {
            return (
              <div key={url} className={styles["imagelist"]}>
                <img src={url} alt={`product image ${index}`} />
                <button type="button" onClick={() => handleRemoveImage(index)}>
                  Delete
                </button>
              </div>
            );
          })}

        <button
          type="button"
          disabled={uploading}
          className="normal"
          onClick={handleImageSubmit}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {imageUploadError && (
          <p style={{ color: "red", fontWeight: "400" }}>{imageUploadError}</p>
        )}
        <button disabled={loading || uploading} className="normal" type="submit">{loading ? "Updating..." : "Update Product"}</button>
        {error && <p style={{ color: "red", fontWeight: "400" }}>{error}</p>}
      </div>
    </form>
  );
}
