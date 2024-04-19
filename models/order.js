const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    totalAmount: {
      type: String,
      required: false,
    },
    orderItems: [],
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
