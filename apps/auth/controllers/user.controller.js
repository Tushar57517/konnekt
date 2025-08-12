import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email.trim() || !password.trim())
      return res.status(400).json({ error: "all fields required" });

    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.status(409).json({ error: "use another email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashedPassword });
    return res.status(200).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email.trim() || !password.trim())
      return res.status(400).json({ error: "all fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "user not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(403).json({ error: "password doesn't match" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
}
