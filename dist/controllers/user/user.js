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
exports.deleteUser = exports.toggleActivation = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const TryCatch_1 = require("../../middlewares/TryCatch");
const paginate_1 = __importDefault(require("../../utils/paginate"));
exports.getAllUsers = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (page <= 0 || limit <= 0) {
        return next(new customError_1.default('Invalid page or limit parameters', 400));
    }
    const users = yield (0, paginate_1.default)(User_1.default, { role: 'user' }, page, limit);
    if (users.data.length === 0) {
        return next(new customError_1.default('No users found', 404));
    }
    res.status(200).json(users);
}));
exports.toggleActivation = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { action } = req.body;
    const user = yield User_1.default.findOne({ _id: id }).select('-password');
    if (!user) {
        return next(new customError_1.default('User not found', 404));
    }
    if (action === 'activate') {
        if (user.isActive) {
            return next(new customError_1.default('User is already active', 400));
        }
        user.isActive = true;
        yield user.save();
        return res.status(200).json({ message: 'User activated successfully', user });
    }
    if (action === 'deactivate') {
        if (!user.isActive) {
            return next(new customError_1.default('User is already inactive', 400));
        }
        user.isActive = false;
        yield user.save();
        return res.status(200).json({ message: 'User deactivated successfully', user });
    }
    return next(new customError_1.default('Invalid action', 400));
}));
exports.deleteUser = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findByIdAndDelete(id);
    if (!user) {
        return next(new customError_1.default('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
    });
}));
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
