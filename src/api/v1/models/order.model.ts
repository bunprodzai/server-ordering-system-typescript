import mongoose from "mongoose";
import { generateOrd } from "../helpers/generateOrd";

const orderSchema = new mongoose.Schema({
  table_id: String,
  code: {
    type: String,
    unique: true,
    default: () => generateOrd()
  },
  status: {
    type: String,
    default: 'initialize'
  },
  // initialize
  // processing
  // received
  // success
  // cancelled
  paymentMethod: {
    type: String,
    default: ""
  },
  paymentAt: Date,
  items: [
    {
      item_id: String,
      quantity: Number,
      title: String,
      price: Number,
      thumbnail: String
    }
  ],
  total_order: Number,
  expireAt: {
    type: Date,
    expires: Date.now() + 2 * 60 * 1000
  }
},
  {
    timestamps: true,
  });

const Order = mongoose.model('Order', orderSchema, "orders");

export default Order;