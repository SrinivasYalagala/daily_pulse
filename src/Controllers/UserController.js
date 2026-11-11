import { getUserDataService,getAllUserService } from "../Services/UserService.js";
import { notFoundResponse, successResponse } from "../Utils/Response.js";

const getUserDataController = async (req, res, next) => {
    try {
        const userId = req.body || {};
        const result = await getUserDataService(userId);
        return successResponse(res, result, "User data found");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "No user found");
        }
        return next(error);
    }
};

const getAllUserController = async (req, res, next) => {
    try {
        const result = await getAllUserService();
        return successResponse(res, result, "User data found");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "No user found");
        }
        return next(error);
    }
};

export { getUserDataController,getAllUserController };