import { v2 as cloudinary } from 'cloudinary';
import {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinarySecretKey
} from '../secret';

if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinarySecretKey) {
  throw new Error('Missing Cloudinary configuration in secret.ts');
}

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinarySecretKey,
});

export default cloudinary;