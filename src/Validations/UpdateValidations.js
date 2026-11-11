import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
    "string.base": "ID must be a string.",
    "string.empty": "ID is required.",
    "string.hex": "Please provide a valid ID.",
    "string.length": "ID must contain exactly 24 characters.",
});

// Screen 04: Post daily update validation
const createUpdateValidation = Joi.object({
    doneYesterday: Joi.string().trim().max(2000).allow("").optional().messages({
        "string.base": "Done yesterday must be a string.",
        "string.max": "Done yesterday cannot exceed 2000 characters.",
    }),
    plannedToday: Joi.string().trim().max(2000).allow("").optional().messages({
        "string.base": "Planned today must be a string.",
        "string.max": "Planned today cannot exceed 2000 characters.",
    }),
    blocked: Joi.string().trim().max(1000).allow("").optional().messages({
        "string.base": "Blocked / need help must be a string.",
        "string.max": "Blocked / need help cannot exceed 1000 characters.",
    }),
    oneNumber: Joi.object({
        label: Joi.string().trim().allow("").optional(),
        value: Joi.number().allow(null).optional(),
    }).optional(),
    userId: objectId.optional().messages({
        "string.base": "User ID must be a string.",
        "string.hex": "Please provide a valid User ID.",
        "string.length": "User ID must contain exactly 24 characters.",
    }),

}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

// Screen 03: Today board filter validation
const todayBoardValidation = Joi.object({
    function: Joi.string().trim().allow("").optional().messages({
        "string.base": "Function filter must be a string.",
    }),
    date: Joi.date().iso().optional().messages({
        "date.base": "Please provide a valid ISO date.",
    }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

// 2. Update UpdateStatus Validation
const updateStatusValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Update ID is required.",
        "string.empty": "Update ID is required.",
    }),
    status: Joi.string()
        .valid("Updated", "Late", "Missing", "Pending", "In Progress", "Completed", "Blocked")
        .required()
        .messages({
            "string.base": "Status must be a string.",
            "string.empty": "Status cannot be empty.",
            "any.only": "Status must be Updated, Late, Missing, Pending, In Progress, Completed, or Blocked.",
            "any.required": "Status is required.",
        }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

// 5. Get Updates Based on User Assigned Validation
const getUpdatesByUserValidation = Joi.object({
    userId: objectId.required().messages({
        "any.required": "User ID is required.",
        "string.empty": "User ID is required.",
    }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

// Helper: General update validation (for all fields)
const updateUpdateValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Update ID is required.",
        "string.empty": "Update ID is required.",
    }),
    doneYesterday: Joi.string().trim().max(2000).allow("").optional(),
    plannedToday: Joi.string().trim().max(2000).allow("").optional(),
    blocked: Joi.string().trim().max(1000).allow("").optional(),
    oneNumber: Joi.object({
        label: Joi.string().trim().allow("").optional(),
        value: Joi.number().allow(null).optional(),
    }).optional(),
    title: Joi.string().trim().min(3).max(100).optional(),
    description: Joi.string().trim().max(2000).allow("").optional(),
    status: Joi.string().valid("Updated", "Late", "Missing", "Pending", "In Progress", "Completed", "Blocked").optional(),
    priority: Joi.string().valid("Low", "Medium", "High", "Critical").optional(),
    relatedAction: objectId.allow(null).optional(),
    linkedDetails: Joi.string().trim().allow("").optional(),
    date: Joi.date().iso().optional(),
}).min(2).unknown(false).messages({
    "object.min": "At least one field to update must be provided along with id.",
    "object.unknown": "You have provided an unsupported field.",
});

// Helper: Get update by ID validation
const getUpdateByIdValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Update ID is required.",
        "string.empty": "Update ID is required.",
    }),
}).unknown(false).messages({
    "object.unknown": "You have provided an unsupported field.",
});

export {
    createUpdateValidation,
    todayBoardValidation,
    updateStatusValidation,
    getUpdatesByUserValidation,
    getUpdateByIdValidation,
    updateUpdateValidation,
    // alias
    getUpdatesByUserValidation as getUpdateByUserIdValidation,
};
