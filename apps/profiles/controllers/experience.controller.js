import Profile from "../models/profile.model.js";
import Experience from "../models/experience.model.js";

export const createExperience = async (req, res) => {
  const { title, org, startDate, endDate } = req.body;

  try {
    if (!title.trim() || !org.trim() || !startDate || !endDate)
      return res.status(400).json({ error: "all fields required" });

    const profile = await Profile.findOne({ user: req.userId });
    const experience = await Experience.create({
      profile: profile._id,
      title,
      org,
      startDate,
      endDate,
    });

    profile.experience.push(experience._id);
    await profile.save();

    return res.status(201).json({ message: "experience added", experience });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const allExperiences = async (req, res) => {
  const { profileId } = req.params;

  try {
    const experiences = await Experience.find({ profile: profileId });
    return res.status(200).json(experiences);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getExperience = async (req, res) => {
  const { expId } = req.params;

  try {
    const experience = await Experience.findById(expId);
    return res.status(200).json(experience);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updateExperience = async (req, res) => {
  const { expId } = req.params;
  const updates = req.body;

  try {
    const experience = await Experience.findByIdAndUpdate(expId, updates, {
      runValidators: true,
      new: true,
    });
    return res.status(200).json({ message: "experience updated", experience });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteExperience = async (req, res) => {
  const { expId } = req.params;

  try {
    const profile = await Profile.findOne({ user: req.userId });
    const experience = await Experience.findById(expId);

    if (req.userId !== profile.user.toString())
      return res.status(403).json({ error: "access denied" });

    await experience.deleteOne();
    await Profile.findByIdAndUpdate(profile._id, {
      $pull: { experience: experience._id },
    });

    return res.status(200).json({ message: "experience deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
