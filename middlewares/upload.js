// // middlewares/upload.js
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import stream from 'stream';
// // import { promisify } from 'util'; 
// // import upload from '../middlewares/upload.js';


// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Create memory storage engine
// // middlewares/upload.js
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files (JPEG, PNG, JPG, GIF) are allowed!'), false);
//     }
//   }
// });
// // Helper function to upload to Cloudinary
// export const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'profile-pictures',
//         allowed_formats: ['jpg', 'jpeg', 'png'],
//         transformation: [{ width: 500, height: 500, crop: 'limit' }]
//       },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );

//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(fileBuffer);
//     bufferStream.pipe(uploadStream);
//   });
// };

// export default upload;