"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tableSchema = new mongoose_1.default.Schema({
    table_number: String,
    qr_code: String,
    status: String,
    slug: { type: String, slug: "table_number", unique: true },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true,
});
const Table = mongoose_1.default.model('Table', tableSchema, "tables");
exports.default = Table;
