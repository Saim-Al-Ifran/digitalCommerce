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
//public routes
router.get('/products', product_1.getAllProducts);
router.get('/products/:id', product_1.getProductById);
router.get('/products/category/:category', product_1.getProductsByCategory);
router.get('/products/inventory/low', product_1.getLowInventoryProducts);
// Admin routes
router.post('/products', authenticate_1.default, authorizeAdmin_1.default, uploadFile_1.default.single('image'), product_1.addProduct);
router.put('/products/:id', authenticate_1.default, authorizeAdmin_1.default, uploadFile_1.default.single('image'), product_1.updateProductById);
router.delete('/products/:id', authenticate_1.default, authorizeAdmin_1.default, product_1.deleteProductById);
exports.default = router;
