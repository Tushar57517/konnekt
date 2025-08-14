import Certificate from "../models/certificate.model.js";
import Profile from "../models/profile.model.js";

export const allCertificates = async (req, res) => {
  const { profileId } = req.params;

  try {
    const certificates = await Certificate.find({ profile: profileId });
    return res.status(200).json(certificates);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getCertificate = async (req, res) => {
  const { certId } = req.params;

  try {
    const certificate = await Certificate.findById(certId);
    return res.status(200).json(certificate);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const createCertificate = async (req, res) => {
  const { name, org, issueDate, expDate, credId, credUrl } = req.body;

  try {
    if (!name.trim() || !org.trim() || !expDate || !issueDate)
      return res.status(400).json({ error: "all fields required" });

    const profile = await Profile.findOne({ user: req.userId });

    const certificate = await Certificate.create({
      profile: profile._id,
      name,
      org,
      issueDate,
      expDate,
      credId,
      credUrl,
    });

    profile.Certificates.push(certificate._id);
    await profile.save();

    return res.status(201).json({ message: "certificate added", certificate });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updateCertificate = async (req, res) => {
  const updates = req.body;
  const { certId } = req.params;

  try {
    const certificate = await Certificate.findByIdAndUpdate(certId, updates, {
      runValidators: true,
      new: true,
    });

    return res
      .status(200)
      .json({ message: "certification updated", certificate });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteCertificate = async (req, res) => {
  const { certId } = req.params;

  try {
    const certificate = await Certificate.findById(certId);
    const profile = await Profile.findById(certificate.profile);
    if (req.userId !== profile.user.toString())
      return res.status(403).json({ error: "access denied" });

    await certificate.deleteOne();

    await Profile.findByIdAndUpdate(profile._id, {
      $pull: { Certificates: certificate._id },
    });
    return res
      .status(200)
      .json({ message: "certification deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
