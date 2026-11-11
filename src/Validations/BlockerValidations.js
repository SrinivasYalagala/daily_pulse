import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
    "string.base": "Must be a valid MongoDB ObjectId",
    "string.empty": "ObjectId is required",
    "string.hex": "Must be a valid 24-character hexadecimal ObjectId",
    "string.length": "ObjectId must contain exactly 24 characters",
    "any.required": "ObjectId is required",
});

// Screen 05: Raise Blocker Validation
const createBlockerValidation = Joi.object({
    blockerTitle: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Blocker title is required",
        "string.min": "Blocker title must be at least 3 characters",
        "string.max": "Blocker title cannot exceed 100 characters",
        "any.required": "Blocker title is required",
    }),
    relatedValue: objectId,
    whoMustAct: objectId,
    raisedBy: objectId,
    severityLevel: Joi.string()
        .trim()
        .valid("Low", "Medium", "High", "Critical")
        .required()
        .messages({
            "any.required": "Severity level is required",
            "string.empty": "Severity level is required",
            "any.only": "Severity level must be Low, Medium, High, or Critical",
        }),

    whatNeed: Joi.string()
        .trim()
        .max(1000)
        .required()
        .messages({
            "any.required": "What needs to be done is required",
            "string.empty": "What needs to be done is required",
            "string.max": "What needs to be done cannot exceed 1000 characters",
        }),

}).unknown(false);

// Screen 06: Acknowledge Blocker Validation
const acknowledgeBlockerValidation = Joi.object({
    id: objectId,
}).unknown(false);

// Screen 06: Mark Resolved Blocker Validation
const resolveBlockerValidation = Joi.object({
    id: objectId,
    resolutionNote: Joi.string().trim().min(3).max(1000).required().messages({
        "string.empty": "Resolution note is required",
        "string.min": "Resolution note must be at least 3 characters",
        "any.required": "Resolution note is required to resolve a blocker",
    }),
}).unknown(false);

// Screen 06: Add Comment to Blocker
const addBlockerCommentValidation = Joi.object({
    id: objectId,
    comment: Joi.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Comment cannot be empty",
        "any.required": "Comment is required",
    }),
}).unknown(false);

// Update Blocker Validation
const updateBlockerValidation = Joi.object({
    id: objectId,
    status: Joi.string()
        .valid("Open", "Pending", "Acknowledged", "In Progress", "Completed", "Resolved", "Blocked")
        .optional()
        .messages({
            "any.only": "Invalid blocker status",
        }),
    blockerTitle: Joi.string().trim().min(3).max(100).optional(),
    whatIsBlocked: Joi.string().trim().max(1000).allow("").optional(),
    whoMustAct: objectId.optional(),
    targetFunction: Joi.string().trim().allow("").optional(),
})
    .min(2)
    .unknown(false);

const getBlockerByIdValidation = Joi.object({
    id: objectId,
}).unknown(false);

export {
    createBlockerValidation,
    acknowledgeBlockerValidation,
    resolveBlockerValidation,
    addBlockerCommentValidation,
    updateBlockerValidation,
    getBlockerByIdValidation,
};
