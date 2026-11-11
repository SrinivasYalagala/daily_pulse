import {
    createAcknowledgementService,
    getAcknowledgementByWorkIdService,
} from "../Services/AcknowledgementService.js";
import { createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

const createAcknowledgementController = async (req, res, next) => {
    try {
        const ackData = req.body || {};
        const response = await createAcknowledgementService(ackData);
        return createResponse(res, response, "Acknowledgement created successfully");
    } catch (error) {
        return next(error);
    }
};

const getAcknowledgementByWorkIdController = async (req, res, next) => {
    try {
        const workData = req.body || {};
        const response = await getAcknowledgementByWorkIdService(workData);
        return successResponse(res, response, "Acknowledgements found successfully");
    } catch (error) {
        return next(error);
    }
};

export {
    createAcknowledgementController,
    getAcknowledgementByWorkIdController,
};
