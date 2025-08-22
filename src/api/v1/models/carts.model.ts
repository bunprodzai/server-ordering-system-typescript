
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  table_id: String,
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

const Cart = mongoose.model('Cart', cartSchema, "carts");

export default Cart;