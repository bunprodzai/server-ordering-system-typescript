
import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const tableSchema = new mongoose.Schema({
  table_number: String,
  qr_code: String,
  status: String,
  items: [
    {
      item_id: String,
      quantity: Number,
      title: String,
      price: Number,
      thumbnail: String
    }
  ],
  items_ordered: [
    {
      item_id: String,
      quantity: Number,
      title: String,
      price: Number,
      thumbnail: String
    }
  ],
  current_code: String,
  state: {
    type: String,
    default: "available" // available, occupied, ordering
  },
  slug: { type: String, slug: "table_number", unique: true, index: true },
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