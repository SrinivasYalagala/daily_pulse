import jwt from 'jsonwebtoken';
import { forbiddenResponse } from '../Utils/Response.js';


const generateJwtToken = (id, roleId) => {
  return jwt.sign(
    {
      _id: id,
      roleId: roleId,
    },
    process.env.JWT_SECRET,
    // {
    //   expiresIn: "365d",
    // }
  );
};


const checkAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: "Unauthorized request - No token" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request - Token missing" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verify._id;
    req.roleId = verify.roleId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
      error: error.message,
    });
  }
};


const checkSuperAdmin = (req, res, next) => {
  if (req.roleId !== 1) {
    return forbiddenResponse(
      res,
      "You are not allowed to perform this action."
    );
  }
  next();
};

const checkhospitalAdmin = (req, res, next) => {
  if (req.roleId !== 2) {
    return forbiddenResponse(
      res,
      "You are not allowed to perform this action."
    );
  }
  next();
};

const checkHealthcareWorker = (req, res, next) => {
  if (req.roleId !== 3) {
    return forbiddenResponse(
      res,
      "You are not allowed to perform this action."
    );
  }
  next();
};



export { generateJwtToken, checkAuth, checkSuperAdmin, checkhospitalAdmin, checkHealthcareWorker };