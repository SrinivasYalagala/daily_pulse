import { registrationService, loginService, authenticationSetupService, verifyAuthOtpService } from "../Services/AuthenticationService.js";
import { conflictResponse, createResponse, forbiddenResponse, notFoundResponse, successResponse } from "../Utils/Response.js";



const registrationController = async (req, res, next) => {
    try {
        const userData = req.body || {};
        const result = await registrationService(userData);
        return createResponse(res, result, "Registered successfully");
    } catch (error) {
        return next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { email } = req.body || {};
        const result = await loginService(email);
        return successResponse(res, result, "Logged in successfully");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "No user found with this email");
        }
        if (error.message === "InActive") {
            return forbiddenResponse(res, "Your account is inactive. Please contact the administrator.");
        }
        return next(error);
    }
};

const authenticationSetupController = async (req, res, next) => {
    try {
        const updatedData = req.body || {};
        const response = await authenticationSetupService(updatedData);
        return successResponse(res, response, "Authentication setup completed");
    } catch (error) {
        return next(error);
    }
}

const verifyAuthOtpController = async (req, res, next) => {
    try {
        const otpData = req.body || {};
        const response = await verifyAuthOtpService(otpData);
        return successResponse(res, response, "Otp verified successfully");
    } catch (error) {
        if (error.message === "Invalid") {
            return conflictResponse(res, "Invalid otp.Please try again.");
        }
        return next(error);
    }
}


export { registrationController, loginController, authenticationSetupController, verifyAuthOtpController };