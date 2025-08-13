import Certificate from "../models/certificate.model.js";

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


