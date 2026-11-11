import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
    "string.base": "ID must be a string.",
    "string.empty": "ID is required.",
    "string.hex": "Please provide a valid 24-character hexadecimal ID.",
    "string.length": "ID must contain exactly 24 characters.",
});

// Screen 09: New Action Validation
const createActionValidation = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": "Action title must be a string.",
        "string.empty": "Action title is required.",
        "string.min": "Action title must contain at least 3 characters.",
        "string.max": "Action title cannot exceed 100 characters.",
        "any.required": "Please enter an action title.",
    }),
     createdBy: objectId.required().messages({
        "any.required": "Action ID is required.",
    }),
    primaryOwner: objectId.required().messages({
        "any.required": "Please select a primary owner.",
    }),
    // Screen 09 requirement: Backup must be a different person
    backupOwner: objectId
        .invalid(Joi.ref("primaryOwner"))
        .required()
        .messages({
            "any.required": "Please select a backup owner.",
            "any.invalid": "Backup owner must be a different person than primary owner.",
        }),
    dueDate: Joi.date().iso().required().messages({
        "date.base": "Please provide a valid due date.",
        "date.format": "Due date must be in ISO date format.",
        "any.required": "Please select a due date.",
    }),
    priority: Joi.string().valid("Low", "Medium", "High", "Critical").required().messages({
        "string.base": "Priority must be a string.",
        "any.only": "Priority must be Low, Medium, High, or Critical.",
        "any.required": "Please select an action priority.",
    }),
    linkedDetails: Joi.string().trim().required().messages({
        "string.base": "Linked details must be a string.",
        "string.empty": "Linked details are required.",
        "any.required": "Please provide linked details.",
    }),
    description: Joi.string().trim().max(1000).required().messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description is required.",
        "string.max": "Description cannot exceed 1000 characters.",
        "any.required": "Please enter an action description.",
    }),
}).unknown(false);

// Screen 10: Close Action Validation (Mandatory closure note)
const closeActionValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Action ID is required.",
    }),
    whatWasDone: Joi.string().trim().min(3).max(1000).required().messages({
        "string.base": "What was done note must be a string.",
        "string.empty": "What was done note is required to close an action.",
        "string.min": "What was done note must contain at least 3 characters.",
        "any.required": "Cannot close action without a note.",
    }),
}).unknown(false);

// Screen 08: Action Register Filter Validation
const actionRegisterValidation = Joi.object({
    tab: Joi.string().valid("Mine", "Function", "Overdue", "All").default("All"),
    function: Joi.string().trim().allow("").optional(),
}).unknown(false);

// Update Status Validation
const updateActionStatusValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Action ID is required.",
    }),
    status: Joi.string()
        .valid("Open", "Pending", "In Progress", "In prog.", "Completed", "Done", "Blocked", "Overdue")
        .required()
        .messages({
            "string.base": "Status must be a string.",
            "string.empty": "Please select an action status.",
            "any.required": "Action status is required.",
        }),
}).unknown(false);

const getActionByIdValidation = Joi.object({
    id: objectId.required().messages({
        "any.required": "Action ID is required.",
    }),
}).unknown(false);

export {
    createActionValidation,
    closeActionValidation,
    actionRegisterValidation,
    updateActionStatusValidation,
    getActionByIdValidation,
};
