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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const delFileFromCloudinary_1 = require("../../utils/delFileFromCloudinary");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const Category_1 = __importDefault(require("../../models/Category"));
const fileUpload_1 = require("../../utils/fileUpload");
const TryCatch_1 = require("../../middlewares/TryCatch");
// Get all categories
exports.getCategories = (0, TryCatch_1.TryCatch)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find();
    if (categories.length === 0) {
        return next(new customError_1.default('No category found!!', 404));
    }
    res.status(200).json(categories);
}));
// Get category by ID
exports.getCategory = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const category = yield Category_1.default.findById({ _id: categoryId });
    if (!category) {
        return next(new customError_1.default('Category not found', 404));
    }
    res.status(200).json(category);
}));
// Create a new category
exports.createCategory = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = req.body;
    const imageFile = req.file;
    console.log(imageFile);
    if (imageFile) {
        const uploadResult = yield (0, fileUpload_1.uploadFileToCloudinary)(imageFile);
        categoryData.image = uploadResult.secure_url;
    }
    const category = new Category_1.default(categoryData);
    yield category.save();
    res.status(201).json(category);
}));
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;
        const imageFile = req.file;
        if (imageFile) {
            const uploadResult = yield (0, fileUpload_1.uploadFileToCloudinary)(imageFile);
            categoryData.imageUrl = uploadResult.secure_url;
        }
        const category = yield Category_1.default.findByIdAndUpdate(categoryId, categoryData, { new: true, runValidators: true });
        if (!category) {
            next(new customError_1.default('Category not found', 404));
        }
        res.status(200).json(category);
    }
    catch (error) {
        next(new customError_1.default(error.message, error.status));
    }
});
exports.updateCategory = updateCategory;
// Delete a category by ID
exports.deleteCategory = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const category = yield Category_1.default.findOne({ _id: categoryId });
    if (!category) {
        next(new customError_1.default('Category not found', 404));
    }
    if (category && category.image) {
        yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(category.image);
    }
    yield Category_1.default.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
}));
