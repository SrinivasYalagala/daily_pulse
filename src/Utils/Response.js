
const successResponse = (res, data, message = "Data found successfully") => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

const createResponse = (res, data, message = "Record created successfully") => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

const notFoundResponse = (res, message) => {
  return res.status(404).json({
    success: false,
    details: "No data found",
    message
  });
};

const conflictResponse = (res, message) => {
  return res.status(409).json({
    success: false,
    details: "Conflict Occurred",
    message
  });
};

const badRequestResponse = (res, message) => {
  return res.status(400).json({
    success: false,
    details: "Bad Request",
    message
  });
};

const validationErrorResponse = (res, message) => {
  return res.status(422).json({
    success: false,
    details: "Validation Failed",
    message
  });
};

const internalServerError = (res, message) => {
  return res.status(500).json({
    success: false,
    details: "Unexpected Error",
    message
  });
};

const forbiddenResponse = (res, message) => {
    return res.status(403).json({
        success: false,
        details:"Forbidden",
        message
    });
};





export {successResponse,createResponse,badRequestResponse,notFoundResponse,conflictResponse,validationErrorResponse,internalServerError,forbiddenResponse};