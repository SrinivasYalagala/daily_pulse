import express from "express";

const updateRouter = express.Router();

import {
    createUpdateController,
    getTodayBoardController,
    updateStatusController,
    getTodaysUpdatesController,
    getAllUpdatesController,
    getUpdatesByUserController,
    getUpdateByIdController,
    updateUpdateController,
} from "../Controllers/UpdateController.js";

import {
    createUpdateValidation,
    todayBoardValidation,
    updateStatusValidation,
    getUpdatesByUserValidation,
    getUpdateByIdValidation,
    updateUpdateValidation,
} from "../Validations/UpdateValidations.js";

import { checkAuth } from "../Utils/Jwt_Token.js";
import validateRequest from "../Utils/Vlaidations.js";

/**
 * @swagger
 * tags:
 *   name: Updates
 *   description: Daily progress and work update APIs
 */

/**
 * @swagger
 * /api/update/create:
 *   post:
 *     summary: Post daily update (Screen 04)
 *     description: Creates a daily work update with Done Yesterday, Planned Today, Blocked/Need Help, and optional metric. Automatically calculates on-time (Updated) or Late status based on 6:00 PM IST cutoff.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUpdateRequest'
 *     responses:
 *       201:
 *         description: Update created successfully
 */
updateRouter.post(
    "/create",
    checkAuth,
    validateRequest(createUpdateValidation),
    createUpdateController
);


/**
 * @swagger
 * /api/update/getByUserId:
 *   post:
 *     summary: Get updates assigned to a user
 *     description: Retrieves all updates assigned to a specific user ID.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetUpdatesByUserRequest'
 *     responses:
 *       200:
 *         description: User updates fetched successfully
 */
updateRouter.post(
    "/getByUserId",
    checkAuth,
    validateRequest(getUpdatesByUserValidation),
    getUpdatesByUserController
);


/**
 * @swagger
 * /api/update/todayBoard:
 *   post:
 *     summary: Get Today Board summary (Screen 03)
 *     description: Retrieves the live team status board for today with top metrics (updated, late, missing, blockers) and team member status list. Supports filtering by function (Sales, Finance, Delivery, HR, etc.).
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodayBoardRequest'
 *     responses:
 *       200:
 *         description: Today board data retrieved successfully
 */
updateRouter.post(
    "/todayBoard",
    checkAuth,
    validateRequest(todayBoardValidation),
    getTodayBoardController
);

/**
 * @swagger
 * /api/update/updateStatus:
 *   post:
 *     summary: Update update status
 *     description: Updates the status of a work update (Updated, Late, Missing, Pending, In Progress, Completed, Blocked).
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Update status updated successfully
 */
updateRouter.post(
    "/updateStatus",
    checkAuth,
    validateRequest(updateStatusValidation),
    updateStatusController
);

/**
 * @swagger
 * /api/update/getTodaysUpdates:
 *   post:
 *     summary: Get today's updates
 *     description: Retrieves all daily work updates logged for today.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's updates fetched successfully
 */
updateRouter.post(
    "/getTodaysUpdates",
    checkAuth,
    getTodaysUpdatesController
);

/**
 * @swagger
 * /api/update/getAll:
 *   post:
 *     summary: Get all updates
 *     description: Retrieves all daily progress updates.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updates retrieved successfully
 */
updateRouter.post("/getAll", checkAuth, getAllUpdatesController);

/**
 * @swagger
 * /api/update/getById:
 *   post:
 *     summary: Get update by ID
 *     description: Retrieves single update details with acknowledgements and blockers using its ID.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetUpdateByIdRequest'
 *     responses:
 *       200:
 *         description: Update details fetched successfully
 */
updateRouter.post(
    "/getById",
    checkAuth,
    validateRequest(getUpdateByIdValidation),
    getUpdateByIdController
);

/**
 * @swagger
 * /api/update/update:
 *   post:
 *     summary: Update an existing update
 *     description: Updates details or status of an existing progress update.
 *     tags: [Updates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUpdateRequest'
 *     responses:
 *       200:
 *         description: Update updated successfully
 */
updateRouter.post(
    "/update",
    checkAuth,
    validateRequest(updateUpdateValidation),
    updateUpdateController
);

export default updateRouter;
