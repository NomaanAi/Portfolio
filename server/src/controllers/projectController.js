import Project from "../models/Project.model.js";
import AppError from "../utils/appError.js";

export const getProjects = async (req, res, next) => {
  try {
    // Public: Return only published/featured or all? Let's return all for now, filter on frontend if needed.
    // Or maybe just sort by order.
    const projects = await Project.find().sort({ order: 1 });
    res.status(200).json({ status: "success", data: projects });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return next(new AppError("No project found with that ID", 404));
    res.status(200).json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return next(new AppError("No project found with that ID", 404));
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};
