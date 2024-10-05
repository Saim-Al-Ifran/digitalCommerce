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
exports.addProduct = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const fileUpload_1 = require("../../utils/fileUpload");
const TryCatch_1 = require("../../middlewares/TryCatch");
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
