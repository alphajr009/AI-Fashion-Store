const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    itemId: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    price: {
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

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
