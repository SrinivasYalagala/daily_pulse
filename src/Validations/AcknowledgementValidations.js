import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
    "string.base": "ID must be a string.",
    "string.empty": "ID is required.",
    "string.hex": "Please provide a valid ID.",
    "string.length": "ID must contain exactly 24 characters.",
});

const createAcknowledgementValidation = Joi.object({
    workId: objectId.required().messages({
        "any.required": "Work ID is required.",
        "string.empty": "Work ID is required.",
    }),
    fromUserId: objectId.optional().messages({
        "string.base": "fromUserId must be a string.",
        "string.hex": "Please provide a valid fromUserId.",
        "string.length": "fromUserId must contain exactly 24 characters.",
    }),
    toUserId: objectId.optional().messages({
        "string.base": "toUserId must be a string.",
        "string.hex": "Please provide a valid toUserId.",
        "string.length": "toUserId must contain exactly 24 characters.",
    }),
    comment: Joi.string().trim().min(1).max(1000).required().messages({
        "string.base": "Comment must be a string.",
        "string.empty": "Comment cannot be empty.",
        "string.min": "Comment must contain at least 1 character.",
        "string.max": "Comment cannot exceed 1000 characters.",
        "any.required": "Comment is required.",
    }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

const getAcknowledgementByWorkIdValidation = Joi.object({
    workId: objectId.required().messages({
        "any.required": "Work ID is required.",
        "string.empty": "Work ID is required.",
    }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

export {
    createAcknowledgementValidation,
    getAcknowledgementByWorkIdValidation,
};
