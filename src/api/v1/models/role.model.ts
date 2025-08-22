import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  title: String,
  description: String,
  permissions: {
    type: Array,
    default: []
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

const Role = mongoose.model('Role', roleSchema, "roles"); //roles là tên connection trong database

export default Role;