import express from 'express';
import { uploadSingleImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Admin
router.post('/', protect, uploadSingleImage('image'), (req, res) => {
    // uploadSingleImage middleware handles uploading to Cloudinary
    // and puts the URL in req.body.image (because fieldName is 'image')

    if (!req.body.image) {
        return res.status(400).json({ status: 'fail', message: 'Upload failed or no file provided' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            url: req.body.image, // Cloudinary URL
            publicId: req.body.imagePublicId
        }
    });
});

export default router;
