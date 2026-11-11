import express from "express";

const blockerRouter = express.Router();

import {
    createBlockerController,
    acknowledgeBlockerController,
    resolveBlockerController,
    addBlockerCommentController,
    getAllBlockerController,
    getBlockerByIdController,
    getEscalatedBlockersController,
    updateBlockerController,
} from "../Controllers/BlockerController.js";

import {
    createBlockerValidation,
    acknowledgeBlockerValidation,
    resolveBlockerValidation,
    addBlockerCommentValidation,
    getBlockerByIdValidation,
    updateBlockerValidation,
} from "../Validations/BlockerValidations.js";

import { checkAuth } from "../Utils/Jwt_Token.js";
import validateRequest from "../Utils/Vlaidations.js";

/**
 * @swagger
 * tags:
 *   name: Blockers
 *   description: Blocker management and escalation APIs
 */

/**
 * @swagger
 * /api/blocker/create:
 *   post:
 *     summary: Raise a new blocker (Screen 05)
 *     description: Creates a blocker associated with an Update or Action. If not resolved within 1 working day (24h), it auto-escalates to CEO and Group Chairman (L1).
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlockerRequest'
 *     responses:
 *       201:
 *         description: Blocker created successfully
 */
blockerRouter.post(
    "/create",
    checkAuth,
    validateRequest(createBlockerValidation),
    createBlockerController
);

/**
 * @swagger
 * /api/blocker/acknowledge:
 *   post:
 *     summary: Acknowledge blocker (Screen 06)
 *     description: Person who must act acknowledges the blocker (within the hour SLA).
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcknowledgeBlockerRequest'
 *     responses:
 *       200:
 *         description: Blocker acknowledged successfully
 */
blockerRouter.post(
    "/acknowledge",
    checkAuth,
    validateRequest(acknowledgeBlockerValidation),
    acknowledgeBlockerController
);

/**
 * @swagger
 * /api/blocker/resolve:
 *   post:
 *     summary: Mark blocker resolved (Screen 06)
 *     description: Resolves a blocker with a mandatory resolution note.
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResolveBlockerRequest'
 *     responses:
 *       200:
 *         description: Blocker resolved successfully
 */
blockerRouter.post(
    "/resolve",
    checkAuth,
    validateRequest(resolveBlockerValidation),
    resolveBlockerController
);

/**
 * @swagger
 * /api/blocker/addComment:
 *   post:
 *     summary: Add comment to blocker (Screen 06)
 *     description: Adds a discussion comment to a blocker thread.
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddBlockerCommentRequest'
 *     responses:
 *       200:
 *         description: Comment added to blocker successfully
 */
blockerRouter.post(
    "/addComment",
    checkAuth,
    validateRequest(addBlockerCommentValidation),
    addBlockerCommentController
);

/**
 * @swagger
 * /api/blocker/getByRaisedId:
 *   post:
 *     summary: Get blocker detail & escalation (Screen 06)
 *     description: Retrieves blocker details, open duration (hours), escalation level (L0/L1), and comments.
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetBlockerByIdRequest'
 *     responses:
 *       200:
 *         description: Blocker details fetched successfully
 */
blockerRouter.post(
    "/getByRaisedId",
    // checkAuth,
    validateRequest(getBlockerByIdValidation),
    getBlockerByIdController
);

/**
 * @swagger
 * /api/blocker/getEscalated:
 *   post:
 *     summary: Get escalated blockers (Screen 13 Daily Digest)
 *     description: Retrieves all blockers open for more than 24 working hours (escalated to CEO + Chairman).
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Escalated blockers retrieved successfully
 */
blockerRouter.post(
    "/getEscalated",
    checkAuth,
    getEscalatedBlockersController
);

/**
 * @swagger
 * /api/blocker/getAll:
 *   post:
 *     summary: Get all blockers
 *     description: Retrieves all blockers with calculated open duration and auto-escalation flags.
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blockers retrieved successfully
 */
blockerRouter.post("/getAll",
    // checkAuth, 
    getAllBlockerController);

/**
 * @swagger
 * /api/blocker/update:
 *   post:
 *     summary: Update an existing blocker
 *     description: Updates blocker details.
 *     tags: [Blockers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBlockerRequest'
 *     responses:
 *       200:
 *         description: Blocker updated successfully
 */
blockerRouter.post(
    "/update",
    checkAuth,
    validateRequest(updateBlockerValidation),
    updateBlockerController
);

export default blockerRouter;
