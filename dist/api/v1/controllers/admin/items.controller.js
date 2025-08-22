"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const items_model_1 = __importDefault(require("../../models/items.model"));
const panigationHelper = __importStar(require("../../../../helpers/pagination"));
const search_1 = require("../../../../helpers/search");
// [GET] /api/v1/admin/items
const index = async (req, res) => {
    if (req.role.permissions.includes("items_view")) {
        const status = req.query.status;
        const limitItem = req.query.limit; // tổng số bảng item trên 1 page
        const find = {
            deleted: false
        };
        if (status) {
            find.status = status;
        }
        // phân trang 
        let initPagination = {
            currentPage: 1,
            limitItems: limitItem
        };
        const countProduct = await items_model_1.default.countDocuments(find);
        const objectPagination = panigationHelper.paginationHelper(initPagination, req.query, countProduct);
        // end phân trang
        // Tìm kiếm
        const objSearch = (0, search_1.searchHelper)(req.query);
        if (objSearch.regex) {
            find.title = objSearch.regex;
        }
        // /api/v1/products?keyword=samsung url để search
        // end Tìm kiếm
        // sort
        const sort = {};
        if (req.query.sortKey && req.query.sortType) {
            const sortKey = Array.isArray(req.query.sortKey) ? req.query.sortKey[0] : req.query.sortKey;
            const sortType = Array.isArray(req.query.sortType) ? req.query.sortType[0] : req.query.sortType;
            if (typeof sortKey === "string" && typeof sortType === "string") {
                sort[sortKey] = sortType; // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
            }
        }
        // }/api/v1/products?sortKey=price&sortType=asc url để query
        // end sort
        const products = await items_model_1.default.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);
        res.json({
            code: 200,
            products: products,
            totalPage: objectPagination
        });
    }
    else {
        res.json({
            code: 403,
            message: "Bạn không có quyền xem sản phẩm!"
        });
    }
};
exports.index = index;
