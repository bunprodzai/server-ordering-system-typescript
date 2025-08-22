
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  position: Number,
  status: {
    type: String,
    default: "active"
  },
  category_id: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const Category = mongoose.model('Category', categorySchema, "categories");

export default Category;