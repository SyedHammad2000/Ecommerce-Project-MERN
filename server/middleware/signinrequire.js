import JWT from "jsonwebtoken";
import Usermodel from "../models/Usermodel.js";
// import Usermodel from "../models/Usermodel.js";

export const Signinreq = (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in verifying jwt ",
    })
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized access",
      });
    } else {
      next();
    }
  } catch (error) {}
};
