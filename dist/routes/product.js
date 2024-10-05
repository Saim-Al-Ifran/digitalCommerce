"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../controllers/product/product");
const authenticate_1 = __importDefault(require("../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../middlewares/auth/authorizeAdmin"));
const uploadFile_1 = __importDefault(require("../middlewares/uploadFile/uploadFile"));
const router = (0, express_1.Router)();
// POST /products - Add a new product
router.post('/products', authenticate_1.default, authorizeAdmin_1.default, uploadFile_1.default.single('image'), product_1.addProduct);
exports.default = router;
