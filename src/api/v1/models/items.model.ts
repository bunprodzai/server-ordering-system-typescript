
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  position: Number,
  price: Number,
  status: {
    type: String,
    default: "active"
  },
  category_id: String,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const Item = mongoose.model('Item', itemSchema, "items");

export default Item;