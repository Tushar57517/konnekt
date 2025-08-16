import Profile from "../models/profile.model.js";
import Education from "../models/education.model.js";
import mongoose from "mongoose";

export const createEducation = async (req, res) => {
  const { institute, course, startDate, endDate, grade } = req.body;

  try {
    if (!institute.trim() || !course.trim() || !startDate || !endDate)
      return res.status(400).json({ error: "all fields required" });

    const profile = await Profile.findOne({ user: req.userId });
    const education = await Education.create({
      profile: profile._id,
      institute,
      course,
      startDate,
      endDate,
      grade
    });

    profile.education.push(education._id);
    await profile.save();

    return res.status(201).json({ message: "education added", education });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const allEducation = async (req, res) => {
  const { profileId } = req.params;

  try {
    const education = await Education.find({ profile: profileId });
    return res.status(200).json(education);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getEducation = async (req, res) => {
  const { eduId } = req.params;

  try {
    const education = await Education.findById(eduId);
    return res.status(200).json(education);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updateEducation = async (req, res) => {
  const updates = req.body;
  const { eduId } = req.params;

  try {
    const education = await Education.findByIdAndUpdate(eduId, updates, {
      runValidators: true,
      new: true,
    });
    return res.status(200).json({ message: "education updated", education });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteEducation = async (req, res) => {
  const { eduId } = req.params;

  try {
    const education = await Education.findById(eduId);
    const profile = await Profile.findById(education.profile);

    if (req.userId !== profile.user.toString())
      return res.status(403).json({ error: "access denied" });

    await education.deleteOne();

    await Profile.findByIdAndUpdate(profile._id, {
      $pull: { education: new mongoose.Types.ObjectId(education._id) },
    });

    return res.status(200).json({ message: "education deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
