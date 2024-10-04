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
exports.refreshTokenController = exports.adminLogin = exports.userLogin = exports.register = void 0;
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../../secret");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
// User Registration
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return next(new customError_1.default('User already exists', 400));
        }
        const newUser = new User_1.default({ username, email, password });
        yield newUser.save();
        const userResponse = {
            username: username,
            email: email
        };
        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    }
    catch (error) {
        next(new customError_1.default(error.message, 500));
    }
});
exports.register = register;
// User Login
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, secret_1.secretKey, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, secret_1.refreshSecretKey, { expiresIn: '7d' });
        user.refreshTokens.push({ token: refreshToken });
        yield user.save();
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'Login successfull', refreshToken, accessToken, user: payload });
    }
    catch (error) {
        next(new customError_1.default(error.message, 500));
    }
});
exports.userLogin = userLogin;
// Admin Login
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            return next(new customError_1.default('Invalid email or password', 401));
        }
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, secret_1.secretKey, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, secret_1.refreshSecretKey, { expiresIn: '7d' });
        user.refreshTokens.push({ token: refreshToken });
        yield user.save();
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'Login successfull', refreshToken, accessToken, user: payload });
    }
    catch (error) {
        next(new customError_1.default(error.message, 500));
    }
});
exports.adminLogin = adminLogin;
//todo
const refreshTokenController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return next(new customError_1.default('Refresh token not provided', 403));
        }
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, secret_1.refreshSecretKey);
        }
        catch (error) {
            throw new customError_1.default('Invalid refresh token', 403);
        }
        const user = yield User_1.default.findOne({ _id: payload.id });
        if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) {
            return next(new customError_1.default('Invalid refresh token', 403));
        }
        const newPayload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        const newAccessToken = jsonwebtoken_1.default.sign(newPayload, secret_1.secretKey, { expiresIn: '1hr' });
        const newRefreshToken = jsonwebtoken_1.default.sign(newPayload, secret_1.refreshSecretKey, { expiresIn: '7d' });
        user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
        user.refreshTokens.push({ token: newRefreshToken });
        yield user.save();
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 3600000 });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ newAccessToken, newRefreshToken });
    }
    catch (err) {
        next(new customError_1.default(err.message, 500));
    }
});
exports.refreshTokenController = refreshTokenController;
