import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(403).json({ error: "no token provided" });

    const token = authHeader.split(" ")[1];
    const deocded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = deocded.userId;

    next();
  } catch (error) {
    console.log(`Auth middleware error: ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};
