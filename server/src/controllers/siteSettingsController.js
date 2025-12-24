import SiteSettings from "../models/SiteSettings.js";
import catchAsync from "../utils/catchAsync.js";

export const getSettings = catchAsync(async (req, res) => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    res.status(200).json({ status: "success", data: { settings } });
});

export const updateSettings = catchAsync(async (req, res) => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create(req.body);
    } else {
        settings = await SiteSettings.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true,
        });
    }
    res.status(200).json({ status: "success", data: { settings } });
});
