import swaggerJSDoc from "swagger-jsdoc";
import j2s from "joi-to-swagger";

/* Authentication */
import { loginValidationSchema, registerValidationSchema, authenticationSetupValidation, authenticationVerifyValidation } from "./src/Validations/AuthenticationValidation.js";
const { swagger: RegisterRequest } = j2s(registerValidationSchema);
const { swagger: LoginRequest } = j2s(loginValidationSchema);
const { swagger: AuthenticationSetupRequest } = j2s(authenticationSetupValidation);
const { swagger: AuthenticationVerifyRequest } = j2s(authenticationVerifyValidation);

import getByIdValidation from "./src/Validations/GetByIdValidation.js";
const { swagger: getByIdRequest } = j2s(getByIdValidation);

/* Action */
import {
    createActionValidation,
    closeActionValidation,
    actionRegisterValidation,
    getActionByIdValidation,
    updateActionStatusValidation,
} from "./src/Validations/ActionValidations.js";
const { swagger: createActionRequest } = j2s(createActionValidation);
const { swagger: CloseActionRequest } = j2s(closeActionValidation);
const { swagger: ActionRegisterRequest } = j2s(actionRegisterValidation);
const { swagger: GetActionByIdRequest } = j2s(getActionByIdValidation);
const { swagger: updateActionRequest } = j2s(updateActionStatusValidation);

/** Blockers */
import {
    createBlockerValidation,
    acknowledgeBlockerValidation,
    resolveBlockerValidation,
    addBlockerCommentValidation,
    getBlockerByIdValidation,
    updateBlockerValidation,
} from "./src/Validations/BlockerValidations.js";
const { swagger: CreateBlockerRequest } = j2s(createBlockerValidation);
const { swagger: AcknowledgeBlockerRequest } = j2s(acknowledgeBlockerValidation);
const { swagger: ResolveBlockerRequest } = j2s(resolveBlockerValidation);
const { swagger: AddBlockerCommentRequest } = j2s(addBlockerCommentValidation);
const { swagger: GetBlockerByIdRequest } = j2s(getBlockerByIdValidation);
const { swagger: UpdateBlockerRequest } = j2s(updateBlockerValidation);

/* Updates */
import {
    createUpdateValidation,
    todayBoardValidation,
    updateStatusValidation,
    updateUpdateValidation,
    getUpdateByIdValidation,
    getUpdatesByUserValidation,
} from "./src/Validations/UpdateValidations.js";
const { swagger: CreateUpdateRequest } = j2s(createUpdateValidation);
const { swagger: TodayBoardRequest } = j2s(todayBoardValidation);
const { swagger: UpdateStatusRequest } = j2s(updateStatusValidation);
const { swagger: UpdateUpdateRequest } = j2s(updateUpdateValidation);
const { swagger: GetUpdateByIdRequest } = j2s(getUpdateByIdValidation);
const { swagger: GetUpdatesByUserRequest } = j2s(getUpdatesByUserValidation);

/* Acknowledgements */
import {
    createAcknowledgementValidation,
    getAcknowledgementByWorkIdValidation,
} from "./src/Validations/AcknowledgementValidations.js";
const { swagger: CreateAcknowledgementRequest } = j2s(createAcknowledgementValidation);
const { swagger: GetAcknowledgementByWorkIdRequest } = j2s(getAcknowledgementByWorkIdValidation);




const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Daily_Pulse",
            version: "1.0.0",
            description: "API documentation for Daily_Pulse"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ],
        components: {
            schemas: {
                /* GetBy Id Request */
                getByIdRequest,

                /* Authentication */
                RegisterRequest,
                LoginRequest,
                AuthenticationSetupRequest,
                AuthenticationVerifyRequest,

                /** Actions */
                createActionRequest,
                CloseActionRequest,
                ActionRegisterRequest,
                GetActionByIdRequest,
                updateActionRequest,

                /** Blockers */
                CreateBlockerRequest,
                AcknowledgeBlockerRequest,
                ResolveBlockerRequest,
                AddBlockerCommentRequest,
                GetBlockerByIdRequest,
                UpdateBlockerRequest,

                /** Updates */
                CreateUpdateRequest,
                TodayBoardRequest,
                UpdateStatusRequest,
                UpdateUpdateRequest,
                GetUpdateByIdRequest,
                GetUpdatesByUserRequest,

                /** Acknowledgements */
                CreateAcknowledgementRequest,
                GetAcknowledgementByWorkIdRequest
            },

            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
        "./src/Routers/*.js"
    ]
};



export default swaggerJSDoc(options);

