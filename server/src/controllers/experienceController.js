import Experience from "../models/Experience.js";
import AppError from "../utils/appError.js";

export const getExperience = async (req, res, next) => {
    try {
        const exp = await Experience.find().sort({ order: 1 });
        res.status(200).json({ status: "success", data: exp });
    } catch (err) {
        next(err);
    }
};

export const createExperience = async (req, res, next) => {
    try {
        const exp = await Experience.create(req.body);
        res.status(201).json({ status: "success", data: exp });
    } catch (err) {
        next(err);
    }
};

export const updateExperience = async (req, res, next) => {
    try {
        const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!exp) return next(new AppError("No experience found with that ID", 404));
        res.status(200).json({ status: "success", data: exp });
    } catch (err) {
        next(err);
    }
};

export const deleteExperience = async (req, res, next) => {
    try {
        const exp = await Experience.findByIdAndDelete(req.params.id);
        if (!exp) return next(new AppError("No experience found with that ID", 404));
        res.status(204).json({ status: "success", data: null });
    } catch (err) {
        next(err);
    }
};
