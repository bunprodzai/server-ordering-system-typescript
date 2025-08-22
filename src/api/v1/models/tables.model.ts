import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  table_number: String,
  qr_code: String,
  status: String,
  slug: { type: String, slug: "table_number", unique: true },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const Table = mongoose.model('Table', tableSchema, "tables");

export default Table;