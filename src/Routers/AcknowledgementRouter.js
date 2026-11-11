import express from "express";

const acknowledgementRouter = express.Router();

import {
    createAcknowledgementController,
    getAcknowledgementByWorkIdController,
} from "../Controllers/AcknowledgementController.js";

import {
    createAcknowledgementValidation,
    getAcknowledgementByWorkIdValidation,
} from "../Validations/AcknowledgementValidations.js";

import { checkAuth } from "../Utils/Jwt_Token.js";
import validateRequest from "../Utils/Vlaidations.js";

/**
 * @swagger
 * tags:
 *   name: Acknowledgements
 *   description: Work update acknowledgement and comment APIs
 */

/**
 * @swagger
 * /api/acknowledgement/create:
 *   post:
 *     summary: Create an acknowledgement / comment on a work update
 *     description: Creates an acknowledgement with a comment for a given workId.
 *     tags: [Acknowledgements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAcknowledgementRequest'
 *     responses:
 *       201:
 *         description: Acknowledgement created successfully
 */
acknowledgementRouter.post(
    "/create",
    checkAuth,
    validateRequest(createAcknowledgementValidation),
    createAcknowledgementController
);

/**
 * @swagger
 * /api/acknowledgement/getByWorkId:
 *   post:
 *     summary: Get acknowledgements and comments by workId
 *     description: Retrieves all acknowledgements and comments for a specific workId in chronological order.
 *     tags: [Acknowledgements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAcknowledgementByWorkIdRequest'
 *     responses:
 *       200:
 *         description: Acknowledgements retrieved successfully
 */
acknowledgementRouter.post(
    "/getByWorkId",
    checkAuth,
    validateRequest(getAcknowledgementByWorkIdValidation),
    getAcknowledgementByWorkIdController
);

export default acknowledgementRouter;
