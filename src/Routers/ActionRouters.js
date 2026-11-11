import express from "express";

const actionRouter = express.Router();

import {
    createActionController,
    closeActionController,
    getActionRegisterController,
    getAllActionsController,
    getActionByIdController,
    updateActionController,
} from "../Controllers/ActionController.js";

import {
    createActionValidation,
    closeActionValidation,
    actionRegisterValidation,
    getActionByIdValidation,
    updateActionStatusValidation,
} from "../Validations/ActionValidations.js";

import { checkAuth } from "../Utils/Jwt_Token.js";
import validateRequest from "../Utils/Vlaidations.js";

/**
 * @swagger
 * tags:
 *   name: Action
 *   description: Action register, management, and closure APIs
 */

/**
 * @swagger
 * /api/action/create:
 *   post:
 *     summary: Create Action (Screen 09)
 *     description: Creates a new action with primary owner, backup owner (must be different), due date, and priority.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createActionRequest'
 *     responses:
 *       201:
 *         description: Action created successfully
 */
actionRouter.post(
    "/create",
    // checkAuth,
    validateRequest(createActionValidation),
    createActionController
);

/**
 * @swagger
 * /api/action/close:
 *   post:
 *     summary: Close Action with mandatory note (Screen 10)
 *     description: Closes an action with a required closure note describing what was done.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CloseActionRequest'
 *     responses:
 *       200:
 *         description: Action closed successfully
 */
actionRouter.post(
    "/close",
    checkAuth,
    validateRequest(closeActionValidation),
    closeActionController
);

/**
 * @swagger
 * /api/action/register:
 *   post:
 *     summary: Action Register by tab (Screen 08)
 *     description: Retrieves actions filtered by tab (Mine, Function, Overdue, All) with calculated overdue flags.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionRegisterRequest'
 *     responses:
 *       200:
 *         description: Actions register retrieved successfully
 */
actionRouter.post(
    "/register",
    checkAuth,
    validateRequest(actionRegisterValidation),
    getActionRegisterController
);

/**
 * @swagger
 * /api/action/getById:
 *   post:
 *     summary: Get Action by ID
 *     description: Retrieves single action details with primary and backup owners.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetActionByIdRequest'
 *     responses:
 *       200:
 *         description: Action details fetched successfully
 */
actionRouter.post(
    "/getById",
    checkAuth,
    validateRequest(getActionByIdValidation),
    getActionByIdController
);

/**
 * @swagger
 * /api/action/getAll:
 *   post:
 *     summary: Get all actions
 *     description: Retrieves all actions across the organization.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actions fetched successfully
 */
actionRouter.post("/getAll", 
    // checkAuth,
     getAllActionsController);

/**
 * @swagger
 * /api/action/update:
 *   post:
 *     summary: Update Action Status
 *     description: Updates action status.
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateActionRequest'
 *     responses:
 *       200:
 *         description: Action updated successfully
 */
actionRouter.post(
    "/update",
    checkAuth,
    validateRequest(updateActionStatusValidation),
    updateActionController
);

export default actionRouter;
