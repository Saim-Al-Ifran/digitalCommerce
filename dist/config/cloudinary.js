"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const secret_1 = require("../secret");
if (!secret_1.cloudinaryCloudName || !secret_1.cloudinaryApiKey || !secret_1.cloudinarySecretKey) {
    throw new Error('Missing Cloudinary configuration in secret.ts');
}
cloudinary_1.v2.config({
    cloud_name: secret_1.cloudinaryCloudName,
    api_key: secret_1.cloudinaryApiKey,
    api_secret: secret_1.cloudinarySecretKey,
});
exports.default = cloudinary_1.v2;
