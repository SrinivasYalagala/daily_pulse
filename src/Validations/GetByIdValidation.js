import Joi from "joi";


const getByIdValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    })
});

export default getByIdValidation;