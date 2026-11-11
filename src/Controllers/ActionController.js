import {
    createActionService,
    closeActionService,
    getActionRegisterService,
    getAllActionsService,
    getActionByIdService,
    updateActionService,
} from "../Services/ActionService.js";
import { badRequestResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

// Screen 09: Create Action
const createActionController = async (req, res, next) => {
    try {
        const actionData = req.body || {};
        const response = await createActionService(actionData);
        return createResponse(res, response, "Action created successfully");
    } catch (error) {
        if (error.message === "DuplicateOwner") {
            return badRequestResponse(res, "Backup owner must be a different person than primary owner");
        }
        return next(error);
    }
};

// Screen 10: Close Action (Requires mandatory note)
const closeActionController = async (req, res, next) => {
    try {
        const { id, whatWasDone } = req.body || {};
        const response = await closeActionService({ id, userId: req.userId, whatWasDone });
        return successResponse(res, response, "Action closed successfully with closure note");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Action not found");
        }
        return next(error);
    }
};

// Screen 08: Action Register (Tabs: Mine, Function, Overdue, All)
const getActionRegisterController = async (req, res, next) => {
    try {
        const { tab = "All", function: functionName } = req.body || {};
        const response = await getActionRegisterService({
            userId: req.userId,
            tab,
            functionName,
        });
        return successResponse(res, response, "Actions register retrieved successfully");
    } catch (error) {
        return next(error);
    }
};

const getAllActionsController = async (req, res, next) => {
    try {
        const response = await getAllActionsService();
        return successResponse(res, response, "Actions fetched successfully");
    } catch (error) {
        return next(error);
    }
};

const getActionByIdController = async (req, res, next) => {
    try {
        const id = req.body?.id;
        const response = await getActionByIdService(id);
        return successResponse(res, response, "Action details fetched successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Action not found");
        }
        return next(error);
    }
};

const updateActionController = async (req, res, next) => {
    try {
        const updatedData = req.body || {};
        const response = await updateActionService(updatedData);
        return successResponse(res, response, "Action updated successfully");
    } catch (error) {
        if (error.message === "NotFound") {
            return notFoundResponse(res, "Action not found");
        }
        return next(error);
    }
};

export {
    createActionController,
    closeActionController,
    getActionRegisterController,
    getAllActionsController,
    getActionByIdController,
    updateActionController,
};
