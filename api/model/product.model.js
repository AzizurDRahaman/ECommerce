import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    clotheType: {
      type: String,
      required: true,
    },
    offer:{
      type:Boolean,
      required: true,
      default: false
    },
    type: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    reviews: [
      {
        rating: {
          type: Number,
          default: 0,
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          default: null,
        },
        user:{
          type: mongoose.Schema.ObjectId,
          ref: "User"
        }
      },
    ],
    ratings:{
      type: Number,
      default:0
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
