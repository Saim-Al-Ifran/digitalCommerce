"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowInventoryProducts = exports.getProductsByCategory = exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const fileUpload_1 = require("../../utils/fileUpload");
const TryCatch_1 = require("../../middlewares/TryCatch");
const paginate_1 = __importDefault(require("../../utils/paginate"));
const Category_1 = __importDefault(require("../../models/Category"));
const delFileFromCloudinary_1 = require("../../utils/delFileFromCloudinary");
// Add a new product
exports.addProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    const imageFile = req.file;
    if (imageFile) {
        const uploadResult = yield (0, fileUpload_1.uploadFileToCloudinary)(imageFile);
        productData.image = uploadResult.secure_url;
    }
    const newProduct = new Product_1.default(productData);
    yield newProduct.save();
    res.status(201).json(newProduct);
}));
// Fetch all products
exports.getAllProducts = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const { search, category, sortBy } = req.query;
    if (page <= 0 || limit <= 0) {
        return next(new customError_1.default('Invalid page or limit parameters', 400));
    }
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
        const categoryData = yield Category_1.default.findOne({ title: { $regex: category, $options: 'i' } });
        if (categoryData) {
            query.category = categoryData._id;
        }
        else {
            return next(new customError_1.default('Category not found!', 404));
        }
    }
    const sort = {};
    switch (sortBy) {
        case 'price_asc':
            sort.price = 1;
            break;
        case 'price_desc':
            sort.price = -1;
            break;
        case 'date_asc':
            sort.createdAt = 1;
            break;
        case 'date_desc':
            sort.createdAt = -1;
            break;
    }
    const products = yield (0, paginate_1.default)(Product_1.default, query, page, limit, sort);
    if (products.data.length === 0) {
        return next(new customError_1.default('No products found', 404));
    }
    res.status(200).json(products);
}));
// Fetch a single product by its ID
exports.getProductById = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield Product_1.default.findById(productId);
    if (!product) {
        next(new customError_1.default('Product not found', 404));
    }
    res.status(200).json(product);
}));
const updateProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.file;
        if (imageFile) {
            const result = yield (0, fileUpload_1.uploadFileToCloudinary)(imageFile);
            updatedData.image = result.secure_url;
            const existingProduct = yield Product_1.default.findById(productId);
            if (existingProduct && existingProduct.image) {
                yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(existingProduct.image);
            }
        }
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            throw new customError_1.default('Product not found', 404);
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        next(new customError_1.default(error.message, 500));
    }
});
exports.updateProductById = updateProductById;
exports.deleteProductById = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Delete endpoint hit');
    const productId = req.params.id;
    const product = yield Product_1.default.findById(productId);
    if (!product) {
        return next(new customError_1.default('Product not found', 404));
    }
    if (product.image) {
        yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(product.image);
    }
    // Delete the product
    yield Product_1.default.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
}));
//  Fetch products in a specific category
exports.getProductsByCategory = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.category;
    const products = yield Product_1.default.find({ category: categoryId });
    if (products.length === 0) {
        return next(new customError_1.default('No products found in this category', 404));
    }
    res.status(200).json(products);
}));
// Fetch products with low inventory
exports.getLowInventoryProducts = (0, TryCatch_1.TryCatch)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lowInventoryProducts = yield Product_1.default.find({ stockQuantity: { $lt: 10 } });
    if (lowInventoryProducts.length === 0) {
        return next(new customError_1.default('No products with low inventory', 404));
    }
    res.status(200).json(lowInventoryProducts);
}));
