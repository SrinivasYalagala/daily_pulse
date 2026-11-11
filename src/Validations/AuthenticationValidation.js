import Joi from "joi";

const registerValidationSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required().messages({
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty",
        "string.base": "Full name must be a string",
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name must be at most 100 characters"
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    }),
    mobileNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
        "any.required": "Mobile number is required",
        "string.empty": "Mobile number cannot be empty",
        "string.base": "Mobile number must be a string of digits",
        "string.pattern.base": "Mobile number must be exactly 10 digits"
    }),
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$")).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base": "Password must include uppercase, lowercase, number and special character"
    }),
    roleId: Joi.number().strict().valid(1, 2, 3).required().messages({
        "any.required": "Role id is required",
        "number.base": "Role id must be a number",
        "any.only": "Role id is not valid"
    }),
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    })
});


const authenticationSetupValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    }),
    totpSecret: Joi.string().required().messages({
        "any.required": "totpSecret is required",
        "string.empty": "totpSecret cannot be empty",
        "string.base": "totpSecret must be a string",
    }),
});

const authenticationVerifyValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    }),
    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "any.required": "OTP is required",
            "string.empty": "OTP cannot be empty",
            "string.length": "OTP must contain exactly 6 digits",
            "string.pattern.base": "OTP must contain only numbers"
        }),

});

// const forgotPasswordValidation = Joi.object({
//     email: Joi.string().email({ tlds: { allow: false } }).required().messages({
//         "any.required": "Email is required",
//         "string.empty": "Email cannot be empty",
//         "string.base": "Email must be a string",
//         "string.email": "Email must be a valid email address"
//     }),
// });

// const resetPasswordValidation = Joi.object({
//     email: Joi.string().email({ tlds: { allow: false } }).required().messages({
//         "any.required": "Email is required",
//         "string.empty": "Email cannot be empty",
//         "string.base": "Email must be a string",
//         "string.email": "Email must be a valid email address"
//     }),
//     password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$")).required().messages({
//         "any.required": "Password is required",
//         "string.empty": "Password cannot be empty",
//         "string.min": "Password must be at least 8 characters",
//         "string.pattern.base": "Password must include uppercase, lowercase, number and special character"
//     }),
// });


// const updatePasswordValidation = Joi.object({
//     id: Joi.string().required().messages({
//         "any.required": "Id is required",
//         "string.empty": "Id cannot be empty"
//     }),
//     password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$")).required().messages({
//         "any.required": "Password is required",
//         "string.empty": "Password cannot be empty",
//         "string.min": "Password must be at least 8 characters",
//         "string.pattern.base": "Password must include uppercase, lowercase, number and special character"
//     }),
//     newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$")).required().messages({
//         "any.required": "New password is required",
//         "string.empty": "New password cannot be empty",
//         "string.min": "New password must be at least 8 characters",
//         "string.pattern.base": "New password must include uppercase, lowercase, number and special character"
//     }),
// });



export { registerValidationSchema, loginValidationSchema, authenticationSetupValidation,authenticationVerifyValidation };