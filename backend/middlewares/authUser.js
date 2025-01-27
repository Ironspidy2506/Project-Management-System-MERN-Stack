import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please log in again.",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    req.body.userId = decode.id;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token. Authorization failed.",
    });
  }
};

export default authUser;
