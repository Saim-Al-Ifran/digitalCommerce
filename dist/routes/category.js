"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../middlewares/auth/authorizeAdmin"));
const uploadFile_1 = __importDefault(require("../middlewares/uploadFile/uploadFile"));
const category_1 = require("../controllers/category/category");
const router = express_1.default.Router();
router.get('/categories', category_1.getCategories);
router.get('/categories/:id', authenticate_1.default, authorizeAdmin_1.default, category_1.getCategory);
router.post('/category', authenticate_1.default, authorizeAdmin_1.default, uploadFile_1.default.single('image'), category_1.createCategory);
router.put('/categories/:id', authenticate_1.default, authorizeAdmin_1.default, uploadFile_1.default.single('image'), category_1.updateCategory);
router.delete('/categories/:id', authenticate_1.default, authorizeAdmin_1.default, category_1.deleteCategory);
exports.default = router;
