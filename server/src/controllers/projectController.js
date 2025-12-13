import Project from '../models/Project.model.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/upload.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res, next) => {
  try {
    console.log('GET /api/projects called');
    const projects = await Project.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    console.error('Get All Projects Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'No project found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Get Project Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    // 1) Handle image uploads (if any)
    if (req.files) {
      // req.body.images = req.files.map(file => file.path);
    }

    // 2) Create project
    const project = await Project.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// @desc    Update a project
// @route   PATCH /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    // 1) Find project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'No project found with that ID' });
    }

    // 2) Handle image updates if needed
    // ...

    // 3) Update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        project: updatedProject,
      },
    });
  } catch (err) {
    console.error('Update Project Error:', err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    // 1) Find project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'No project found with that ID' });
    }

    // 2) Delete associated images from Cloudinary
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images.map(async (image) => {
        if (image.publicId) {
          try {
            await deleteFromCloudinary(image.publicId);
          } catch (e) {
            console.error('Error deleting image from cloudinary:', e);
            // Continue even if image deletion fails
          }
        }
      });

      await Promise.all(deletePromises);
    }

    // 3) Delete project from database
    await Project.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.error('Delete Project Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Upload project images
// @route   POST /api/projects/:id/images
// @access  Private/Admin
export const uploadProjectImages = [
  uploadMultipleImages('images', 5),
  async (req, res, next) => {
    try {
      if (!req.body.images || req.body.images.length === 0) {
        return res.status(400).json({ status: 'fail', message: 'Please upload at least one image' });
      }

      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ status: 'fail', message: 'No project found with that ID' });
      }

      // Add new images to the project
      project.images.push(...req.body.images);
      await project.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        data: {
          project,
        },
      });
    } catch (err) {
      console.error('Upload Project Images Error:', err);
      res.status(400).json({ status: 'error', message: err.message });
    }
  },
];

// @desc    Delete a project image
// @route   DELETE /api/projects/:id/images/:imageId
// @access  Private/Admin
export const deleteProjectImage = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'No project found with that ID' });
    }

    // Find the image to delete
    const imageIndex = project.images.findIndex(
      (img) => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ status: 'fail', message: 'No image found with that ID' });
    }

    // Delete image from Cloudinary
    const imageToDelete = project.images[imageIndex];
    if (imageToDelete.publicId) {
      try {
        await deleteFromCloudinary(imageToDelete.publicId);
      } catch (e) {
        console.error('Cloudinary delete error:', e);
      }
    }

    // Remove image from project
    project.images.splice(imageIndex, 1);
    await project.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    console.error('Delete Project Image Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
