import Project from '../models/Project.model.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/upload.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = catchAsync(async (req, res, next) => {
  // 1) Handle image uploads
  if (req.files) {
    // Handle multiple images if needed
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
});

// @desc    Update a project
// @route   PATCH /api/projects/:id
// @access  Private/Admin
export const updateProject = catchAsync(async (req, res, next) => {
  // 1) Find project
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
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
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = catchAsync(async (req, res, next) => {
  // 1) Find project
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  // 2) Delete associated images from Cloudinary
  if (project.images && project.images.length > 0) {
    const deletePromises = project.images.map(async (image) => {
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
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
});

// @desc    Upload project images
// @route   POST /api/projects/:id/images
// @access  Private/Admin
export const uploadProjectImages = [
  uploadMultipleImages('images', 5),
  catchAsync(async (req, res, next) => {
    if (!req.body.images || req.body.images.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return next(new AppError('No project found with that ID', 404));
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
  }),
];

// @desc    Delete a project image
// @route   DELETE /api/projects/:id/images/:imageId
// @access  Private/Admin
export const deleteProjectImage = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  // Find the image to delete
  const imageIndex = project.images.findIndex(
    (img) => img._id.toString() === req.params.imageId
  );
  
  if (imageIndex === -1) {
    return next(new AppError('No image found with that ID', 404));
  }
  
  // Delete image from Cloudinary
  const imageToDelete = project.images[imageIndex];
  if (imageToDelete.publicId) {
    await deleteFromCloudinary(imageToDelete.publicId);
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
});
