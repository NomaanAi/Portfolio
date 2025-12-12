import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware to handle single file upload
const uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message,
        });
      }

      if (!req.file) {
        return next();
      }

      try {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        
        // Add Cloudinary URL and public_id to request body
        req.body[fieldName] = result.secure_url;
        req.body[`${fieldName}PublicId`] = result.public_id;
        
        next();
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Error uploading file',
        });
      }
    });
  };
};

// Middleware to handle multiple file uploads
const uploadMultipleImages = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message,
        });
      }

      if (!req.files || req.files.length === 0) {
        return next();
      }

      try {
        // Upload all files to Cloudinary
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        
        const results = await Promise.all(uploadPromises);
        
        // Add Cloudinary URLs and public_ids to request body
        req.body[fieldName] = results.map((result) => ({
          url: result.secure_url,
          publicId: result.public_id,
        }));
        
        next();
      } catch (error) {
        console.error('Error uploading files to Cloudinary:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Error uploading files',
        });
      }
    });
  };
};

export { uploadSingleImage, uploadMultipleImages };
