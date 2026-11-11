import express from 'express';
const userRouter = express.Router();
import validateRequest from "../Utils/Vlaidations.js";
import { checkAuth } from '../Utils/Jwt_Token.js';
import { getUserDataController,getAllUserController } from "../Controllers/UserController.js";
import getByIdValidation from '../Validations/GetByIdValidation.js';



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User data crud oops
 */


/**
 * @swagger
 * /api/user/getUserData:
 *   post:
 *     summary: Get user data by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/getByIdRequest'
 *     responses:
 *       200:
 *         description: User data fetched successfully
 */

userRouter.post("/getUserData",checkAuth,validateRequest(getByIdValidation),getUserDataController);


/**
 * @swagger
 * /api/user/getAll:
 *   post:
 *     summary: Get users data
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: User data fetched successfully
 */

userRouter.post("/getAll",checkAuth,getAllUserController);

export default userRouter;