import Skill from "../models/Skill.js";
import AppError from "../utils/appError.js";

// Public
export const getSkills = async (req, res, next) => {
    try {
        const skills = await Skill.find().sort({ order: 1 });
        res.status(200).json({ status: "success", data: skills });
    } catch (err) {
        next(err);
    }
};

// Admin Only
export const createSkill = async (req, res, next) => {
    try {
        console.log("createSkill START", req.body);
        const skill = await Skill.create(req.body);
        console.log("createSkill SUCCESS", skill);
        res.status(201).json({ status: "success", data: skill });
    } catch (err) {
        console.error("createSkill ERROR", err);
        next(err);
    }
};

export const updateSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!skill) return next(new AppError("No skill found with that ID", 404));
        res.status(200).json({ status: "success", data: skill });
    } catch (err) {
        next(err);
    }
};

export const deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return next(new AppError("No skill found with that ID", 404));
        res.status(204).json({ status: "success", data: null });
    } catch (err) {
        next(err);
    }
};

export const reorderSkills = async (req, res, next) => {
    try {
        const { orderedIds } = req.body; // Array of IDs in new order
        const operations = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { order: index }
            }
        }));
        await Skill.bulkWrite(operations);
        res.status(200).json({ status: "success", message: "Skills reordered" });
    } catch (err) {
        next(err);
    }
}
