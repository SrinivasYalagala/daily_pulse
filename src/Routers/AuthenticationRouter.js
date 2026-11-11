import express from "express";
const authenticationRouter = express.Router();
import { registrationController, loginController,authenticationSetupController, verifyAuthOtpController} from "../Controllers/AuthenticationController.js";
import { registerValidationSchema,loginValidationSchema,authenticationSetupValidation,authenticationVerifyValidation} from "../Validations/AuthenticationValidation.js";
import validateRequest from "../Utils/Vlaidations.js";



/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and Authorization APIs
 */

/**
 * @swagger
 * /api/authentication/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 */

authenticationRouter.post("/register", validateRequest(registerValidationSchema), registrationController);


/**
 * @swagger
 * /api/authentication/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: login exist user
 *     description: Authenticates a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User found in successfully
 */
authenticationRouter.post("/login", validateRequest(loginValidationSchema), loginController);



/**
 * @swagger
 * /api/authentication/setup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User authentication setup
 *     description: Authenticates a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationSetupRequest'
 *     responses:
 *       200:
 *         description: Setup completed successfully
 */
authenticationRouter.post("/setup", validateRequest(authenticationSetupValidation), authenticationSetupController);


/**
 * @swagger
 * /api/authentication/verifyOtp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User authentication verification
 *     description: Authenticates a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationVerifyRequest'
 *     responses:
 *       200:
 *         description: User authentication verification completed successfully
 */
authenticationRouter.post("/verifyOtp", validateRequest(authenticationVerifyValidation), verifyAuthOtpController);


export default authenticationRouter;