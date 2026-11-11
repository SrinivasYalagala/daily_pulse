import {
    createBlockerService,
    acknowledgeBlockerService,
    resolveBlockerService,
    addBlockerCommentService,
    getAllBlockersService,
    getBlockerByIdService,
    getEscalatedBlockersService,
    updateBlockerService,
} from "../Services/BlockerService.js";
import { createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

// Screen 05: Raise Blocker
const createBlockerController = async (req, res, next) => {
    try {
        const blockerData = {
            ...(req.body || {}),
            raisedBy: req.body?.raisedBy || req.userId,
        };
        const response = await createBlockerService(blockerData);
        return createResponse(res, response, "Blocker raised successfully");
    } catch (error) {
        return next(error);
    }
};

// Screen 06: Acknowledge Blocker
const acknowledgeBlockerController = async (req, res, next) => {
    try {
        const id = req.body?.id;
        const response = await acknowledgeBlockerService({ id, userId: req.userId });
        return successResponse(res, response, "Blocker acknowledged successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Blocker not found");
        }
        return next(error);
    }
};

// Screen 06: Mark Blocker Resolved
const resolveBlockerController = async (req, res, next) => {
    try {
        const { id, resolutionNote } = req.body || {};
        const response = await resolveBlockerService({ id, resolutionNote });
        return successResponse(res, response, "Blocker resolved successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Blocker not found");
        }
        return next(error);
    }
};

// Screen 06: Add Comment to Blocker
const addBlockerCommentController = async (req, res, next) => {
    try {
        const { id, comment } = req.body || {};
        const response = await addBlockerCommentService({ id, userId: req.userId, comment });
        return successResponse(res, response, "Comment added to blocker successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Blocker not found");
        }
        return next(error);
    }
};

// Get All Blockers
const getAllBlockerController = async (req, res, next) => {
    try {
        const filters = req.body || {};
        const response = await getAllBlockersService(filters);
        return successResponse(res, response, "Blockers retrieved successfully");
    } catch (error) {
        return next(error);
    }
};

// Screen 06: Get Blocker By ID
const getBlockerByIdController = async (req, res, next) => {
    try {
        const id = req.body?.id;
        const response = await getBlockerByIdService(id);
        return successResponse(res, response, "Blocker details found successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Blocker not found");
        }
        return next(error);
    }
};

// Get Escalated Blockers (Screen 13 Daily digest / CEO review)
const getEscalatedBlockersController = async (req, res, next) => {
    try {
        const response = await getEscalatedBlockersService();
        return successResponse(res, response, "Escalated blockers retrieved successfully");
    } catch (error) {
        return next(error);
    }
};

// Update Blocker
const updateBlockerController = async (req, res, next) => {
    try {
        const updatedData = req.body || {};
        const response = await updateBlockerService(updatedData);
        return successResponse(res, response, "Blocker updated successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Blocker not found");
        }
        return next(error);
    }
};

export {
    createBlockerController,
    acknowledgeBlockerController,
    resolveBlockerController,
    addBlockerCommentController,
    getAllBlockerController,
    getBlockerByIdController,
    getEscalatedBlockersController,
    updateBlockerController,
};
