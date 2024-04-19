const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    occasion: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
