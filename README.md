# Express + TypeScript Starter Kit

This is a boilerplate project for building backend applications using Express and TypeScript. It includes essential configurations, middleware, and tools to kickstart your development process.

## Features

- **TypeScript**: Static type-checking along with modern JavaScript features.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Cloudinary**: Media management for handling image uploads and delivery.
- **Helmet**: Secure your Express apps by setting various HTTP headers.
- **Multer**: Middleware for handling `multipart/form-data`, primarily for file uploads.
- **JSON Web Tokens (JWT)**: Secure authentication via tokens.
- **Express Validator**: Validation middleware for handling and validating request data.
- **Morgan**: HTTP request logger middleware.
- **Compression**: Gzip compression for improved performance.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Cookie Parser**: Parse Cookie header and populate `req.cookies`.

## Getting Started

### Prerequisites

- **Node.js**: Install the latest version of Node.js from [here](https://nodejs.org/).
- **npm**: Node.js package manager, comes with Node.js installation.

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/express-typescript-starter-kit.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd express-typescript-starter-kit
    ```

3. **Install the dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/mydatabase

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
