
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  role_id: String,
  fullName: String,
  email: String,
  password: String,
  phone: String,
  avatar: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const Account = mongoose.model('Account', accountSchema, "accounts");

export default Account; 