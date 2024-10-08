import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const protect = async (req, res, next) => {
  try {
    //checking token in cookie
    const token = req.cookies.token;
    // not find cookie show this response
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //verify failed then show this response
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    //find the user associated with the decoded userId
    const user = await User.findById(decoded.userId);

    //user id not found show this response
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Attach user ID to request headers for further use
    req.headers.id = user._id;
    //give access to next etc
    next();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export default protect;
