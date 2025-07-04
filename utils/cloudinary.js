// // config/cloudinary.js
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY,      
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// // Multer Storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'profile-pictures',
//     allowed_formats: ['jpg', 'jpeg', 'png'], 
//   },
// });

// export { storage, cloudinary };