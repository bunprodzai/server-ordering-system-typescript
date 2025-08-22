"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const Order = mongoose_1.default.model('Order', orderSchema, "orders");
exports.default = Order;
