import { validationErrorResponse } from "../Utils/Response.js";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return validationErrorResponse(res, errors);
    }
    next();
  };
};

export default validateRequest;