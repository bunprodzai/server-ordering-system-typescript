import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cart_id: String,
  table_id: String,
  code: String,
  status: String,
  paymentMethod: String,
  paymentAt: Date,
  items: [
    {
      item_id: String,
      quantity: Number
    }
  ],

  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const Order = mongoose.model('Order', orderSchema, "orders");

export default Order;