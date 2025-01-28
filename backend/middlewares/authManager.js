import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const authManager = async (req, res, next) => {
  try {
    const { mtoken } = req.headers;
    if (!mtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const decode = jwt.verify(mtoken, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    req.body.userId = decode.id;

    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Login Auth server error" });
  }
};

export default authManager;
