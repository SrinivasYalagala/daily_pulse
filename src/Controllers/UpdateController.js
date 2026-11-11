import {
    createUpdateService,
    getTodayBoardService,
    updateStatusService,
    getTodaysUpdatesService,
    getAllUpdatesService,
    getUpdatesByUserService,
    getUpdateByIdService,
} from "../Services/UpdateService.js";
import { createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

// 1. Create Update (Screen 04: Post Daily Update)
const createUpdateController = async (req, res, next) => {
    try {
        const updateData = req.body || {};
        const response = await createUpdateService(updateData);
        return createResponse(res, response, "Update created successfully");
    } catch (error) {
        return next(error);
    }
};

// 2. Get Updates Based on User Assigned
const getUpdatesByUserController = async (req, res, next) => {
    try {
        const userData = {
            userId: req.body?.userId || req.userId,
        };
        const response = await getUpdatesByUserService(userData);
        return successResponse(res, response, "User updates fetched successfully");
    } catch (error) {
        return next(error);
    }
};


// Screen 03: Today Board (Home)
const getTodayBoardController = async (req, res, next) => {
    try {
        const filters = req.body || {};
        const response = await getTodayBoardService(filters);
        return successResponse(res, response, "Today board data retrieved successfully");
    } catch (error) {
        return next(error);
    }
};

// 2. Update UpdateStatus
const updateStatusController = async (req, res, next) => {
    try {
        const statusData = req.body || {};
        const response = await updateStatusService(statusData);
        return successResponse(res, response, "Update status updated successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "No update found");
        }
        return next(error);
    }
};

// 3. Get Todays Updates
const getTodaysUpdatesController = async (req, res, next) => {
    try {
        const response = await getTodaysUpdatesService();
        return successResponse(res, response, "Today's updates fetched successfully");
    } catch (error) {
        return next(error);
    }
};

// 4. Get All Updates
const getAllUpdatesController = async (req, res, next) => {
    try {
        const response = await getAllUpdatesService();
        return successResponse(res, response, "Updates found successfully");
    } catch (error) {
        return next(error);
    }
};




// Helper: Get update by ID
const getUpdateByIdController = async (req, res, next) => {
    try {
        const updateId = req.body || {};
        const response = await getUpdateByIdService(updateId);
        return successResponse(res, response, "Update details found successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "No update found");
        }
        return next(error);
    }
};

export {
    createUpdateController,
    getTodayBoardController,
    updateStatusController,
    getTodaysUpdatesController,
    getAllUpdatesController,
    getUpdatesByUserController,
    getUpdateByIdController,
    // aliases
    updateStatusController as updateUpdateController,
    getUpdatesByUserController as getUpdateByUserIdController,
};
