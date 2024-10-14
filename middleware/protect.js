import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.headers.id = user._id;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export default protect;
